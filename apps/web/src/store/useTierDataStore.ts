import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { COLOR_PRESETS, TEMPLATES } from '../lib/constants'
import type {
  TemplateData,
  Tier,
  TierItem,
  TierListContainers,
  TierListHistoryState,
} from '../lib/types'
import { useMetadataStore } from './useMetadataStore'
import { useHistoryStore } from './useHistoryStore'
import { useTemplatesStore } from './useTemplatesStore'

export interface TierDataState {
  tiers: Tier[]
  items: TierItem[]
  containers: TierListContainers

  // Actions - Templates
  loadTemplate: (templateId: string, customTemplate?: TemplateData) => void
  resetCurrentTemplate: () => void

  // Actions - Tiers
  addTier: (position?: 'top' | 'bottom') => void
  updateTier: (id: string, updates: Partial<Tier>) => void
  deleteTier: (id: string) => void
  moveTier: (id: string, direction: 'up' | 'down') => void
  clearTier: (id: string) => void
  clearAllTiers: () => void

  // Actions - Items
  addItem: (
    item: { title: string; imageUrl?: string; category?: string; subtitle?: string },
    targetContainerId?: string,
  ) => void
  updateItem: (id: string, updates: Partial<TierItem>) => void
  deleteItem: (id: string) => void
  moveItemToTier: (itemId: string, targetTierId: string) => void
  shufflePool: () => void
  resetAllToPool: () => void
  bulkAddItems: (
    itemsList: Array<{ title: string; imageUrl?: string; category?: string }>,
  ) => void

  // DnD Container updater
  setContainers: (
    containersOrUpdater:
      TierListContainers | ((prev: TierListContainers) => TierListContainers),
  ) => void

  // Config import
  importConfig: (data: Partial<TemplateData>) => void
}

const defaultTemplate = TEMPLATES[0]

function createCurrentSnapshot(): TierListHistoryState {
  const meta = useMetadataStore.getState()
  const data = useTierDataStore.getState()
  return {
    title: meta.title,
    subtitle: meta.subtitle,
    author: meta.author,
    tiers: JSON.parse(JSON.stringify(data.tiers)),
    items: JSON.parse(JSON.stringify(data.items)),
    containers: JSON.parse(JSON.stringify(data.containers)),
  }
}

function recordHistory() {
  useHistoryStore.getState().pushSnapshot(createCurrentSnapshot())
}

export function performUndo() {
  const historyStore = useHistoryStore.getState()
  if (!historyStore.canUndo()) return

  const meta = useMetadataStore.getState()
  const data = useTierDataStore.getState()
  const currentSnap: TierListHistoryState = {
    title: meta.title,
    subtitle: meta.subtitle,
    author: meta.author,
    tiers: JSON.parse(JSON.stringify(data.tiers)),
    items: JSON.parse(JSON.stringify(data.items)),
    containers: JSON.parse(JSON.stringify(data.containers)),
  }

  const prev = historyStore.popUndo()
  if (!prev) return

  useHistoryStore.setState((state) => ({
    future: [currentSnap, ...state.future.slice(0, 20)],
  }))

  useMetadataStore.setState({
    title: prev.title,
    subtitle: prev.subtitle,
    author: prev.author,
  })
  useTierDataStore.setState({
    tiers: prev.tiers,
    items: prev.items,
    containers: prev.containers,
  })
}

export function performRedo() {
  const historyStore = useHistoryStore.getState()
  if (!historyStore.canRedo()) return

  const meta = useMetadataStore.getState()
  const data = useTierDataStore.getState()
  const currentSnap: TierListHistoryState = {
    title: meta.title,
    subtitle: meta.subtitle,
    author: meta.author,
    tiers: JSON.parse(JSON.stringify(data.tiers)),
    items: JSON.parse(JSON.stringify(data.items)),
    containers: JSON.parse(JSON.stringify(data.containers)),
  }

  const next = historyStore.popRedo()
  if (!next) return

  useHistoryStore.setState((state) => ({
    history: [...state.history.slice(-20), currentSnap],
  }))

  useMetadataStore.setState({
    title: next.title,
    subtitle: next.subtitle,
    author: next.author,
  })
  useTierDataStore.setState({
    tiers: next.tiers,
    items: next.items,
    containers: next.containers,
  })
}

export const useTierDataStore = create<TierDataState>()(
  persist(
    (set, get) => ({
      tiers: defaultTemplate.tiers,
      items: defaultTemplate.items,
      containers: defaultTemplate.containers,

      loadTemplate: (templateId, customTemplate) => {
        recordHistory()
        let template =
          customTemplate ||
          useTemplatesStore.getState().templates.find((t) => t.id === templateId) ||
          TEMPLATES.find((t) => t.id === templateId)

        if (!template) {
          // Attempt async fetch in background if not yet loaded
          useTemplatesStore.getState().getTemplateById(templateId).then((fetched) => {
            if (fetched) {
              get().loadTemplate(templateId, fetched)
            }
          })
          template = TEMPLATES[0]
        }

        useMetadataStore.setState({
          selectedTemplateId: template.id,
          title: template.title,
          subtitle: template.subtitle,
          author: template.author,
        })
        set({
          tiers: JSON.parse(JSON.stringify(template.tiers)),
          items: JSON.parse(JSON.stringify(template.items)),
          containers: JSON.parse(JSON.stringify(template.containers)),
        })
      },

      resetCurrentTemplate: () => {
        const currentId = useMetadataStore.getState().selectedTemplateId
        get().loadTemplate(currentId)
      },

      addTier: (position = 'bottom') => {
        recordHistory()
        const currentTiers = get().tiers
        const newIndex = currentTiers.length + 1
        const randomPreset = COLOR_PRESETS[newIndex % COLOR_PRESETS.length]
        const newTierId = `tier-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}`

        const newTier: Tier = {
          id: newTierId,
          title: `Tier ${String.fromCharCode(64 + Math.min(newIndex, 26))}`,
          color: randomPreset.bg,
          textColor: randomPreset.text,
        }

        const newTiers =
          position === 'top' ? [newTier, ...currentTiers] : [...currentTiers, newTier]
        const newContainers = {
          ...get().containers,
          [newTierId]: [],
        }

        set({
          tiers: newTiers,
          containers: newContainers,
        })
      },

      updateTier: (id, updates) => {
        recordHistory()
        set((state) => ({
          tiers: state.tiers.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        }))
      },

      deleteTier: (id) => {
        recordHistory()
        const state = get()
        const tierItems = state.containers[id] || []
        const poolItems = state.containers['POOL'] || []

        const newContainers = { ...state.containers }
        delete newContainers[id]
        newContainers['POOL'] = [...poolItems, ...tierItems]

        set({
          tiers: state.tiers.filter((t) => t.id !== id),
          containers: newContainers,
        })
      },

      moveTier: (id, direction) => {
        recordHistory()
        const currentTiers = [...get().tiers]
        const index = currentTiers.findIndex((t) => t.id === id)
        if (index === -1) return
        if (direction === 'up' && index === 0) return
        if (direction === 'down' && index === currentTiers.length - 1) return

        const targetIndex = direction === 'up' ? index - 1 : index + 1
        const [moved] = currentTiers.splice(index, 1)
        currentTiers.splice(targetIndex, 0, moved)

        set({ tiers: currentTiers })
      },

      clearTier: (id) => {
        const state = get()
        const tierItems = state.containers[id] || []
        if (tierItems.length === 0) return

        recordHistory()
        const poolItems = state.containers['POOL'] || []
        set({
          containers: {
            ...state.containers,
            [id]: [],
            POOL: [...poolItems, ...tierItems],
          },
        })
      },

      clearAllTiers: () => {
        get().resetAllToPool()
      },

      addItem: (itemData, targetContainerId = 'POOL') => {
        recordHistory()
        const newItemId = `item-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}`
        const newItem: TierItem = {
          id: newItemId,
          title: itemData.title.trim(),
          imageUrl: itemData.imageUrl?.trim() || undefined,
          category: itemData.category?.trim() || 'Custom',
          subtitle: itemData.subtitle?.trim() || undefined,
        }

        const state = get()
        const targetList = state.containers[targetContainerId] || []

        set({
          items: [newItem, ...state.items],
          containers: {
            ...state.containers,
            [targetContainerId]: [newItemId, ...targetList],
          },
        })
      },

      updateItem: (id, updates) => {
        recordHistory()
        set((state) => ({
          items: state.items.map((i) => (i.id === id ? { ...i, ...updates } : i)),
        }))
      },

      deleteItem: (id) => {
        recordHistory()
        const state = get()
        const newContainers: TierListContainers = {}

        for (const [cId, itemIds] of Object.entries(state.containers)) {
          newContainers[cId] = itemIds.filter((itemId) => itemId !== id)
        }

        set({
          items: state.items.filter((i) => i.id !== id),
          containers: newContainers,
        })
      },

      moveItemToTier: (itemId, targetTierId) => {
        recordHistory()
        const state = get()
        const currentContainers = { ...state.containers }

        for (const cId of Object.keys(currentContainers)) {
          currentContainers[cId] = currentContainers[cId].filter((id) => id !== itemId)
        }

        currentContainers[targetTierId] = [
          ...(currentContainers[targetTierId] || []),
          itemId,
        ]

        set({ containers: currentContainers })
      },

      shufflePool: () => {
        recordHistory()
        const state = get()
        const pool = [...(state.containers['POOL'] || [])]
        for (let i = pool.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1))
          ;[pool[i], pool[j]] = [pool[j], pool[i]]
        }

        set({
          containers: {
            ...state.containers,
            POOL: pool,
          },
        })
      },

      resetAllToPool: () => {
        recordHistory()
        const state = get()
        const allItemIds = state.items.map((i) => i.id)
        const emptyContainers: TierListContainers = { POOL: allItemIds }

        for (const tier of state.tiers) {
          emptyContainers[tier.id] = []
        }

        set({ containers: emptyContainers })
      },

      bulkAddItems: (itemsList) => {
        if (!itemsList.length) return
        recordHistory()
        const state = get()

        const newItems: TierItem[] = []
        const newItemIds: string[] = []

        itemsList.forEach((it, idx) => {
          const id = `item-${Date.now().toString(36)}-${idx}-${Math.random().toString(36).substring(2, 5)}`
          newItems.push({
            id,
            title: it.title,
            imageUrl: it.imageUrl,
            category: it.category || 'Custom',
          })
          newItemIds.push(id)
        })

        set({
          items: [...newItems, ...state.items],
          containers: {
            ...state.containers,
            POOL: [...newItemIds, ...(state.containers['POOL'] || [])],
          },
        })
      },

      setContainers: (containersOrUpdater) => {
        set((state) => {
          const newContainers =
            typeof containersOrUpdater === 'function'
              ? containersOrUpdater(state.containers)
              : containersOrUpdater
          return { containers: newContainers }
        })
      },

      importConfig: (data) => {
        recordHistory()
        const state = get()
        useMetadataStore.setState({
          title: data.title || useMetadataStore.getState().title,
          subtitle: data.subtitle || useMetadataStore.getState().subtitle,
          author: data.author || useMetadataStore.getState().author,
        })
        set({
          tiers: data.tiers || state.tiers,
          items: data.items || state.items,
          containers: data.containers || state.containers,
        })
      },
    }),
    {
      name: 'tier-list-data-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        tiers: state.tiers,
        items: state.items,
        containers: state.containers,
      }),
    },
  ),
)
