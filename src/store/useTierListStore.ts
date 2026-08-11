import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { COLOR_PRESETS, TEMPLATES } from '../lib/constants'
import type { ItemSize, TemplateData, Tier, TierItem, TierListContainers, TierListHistoryState } from '../lib/types'

export type PresentationTheme = 'studio' | 'neon' | 'slate' | 'noir' | 'clean'

interface TierListState {
  // Theme & Appearance
  theme: 'dark' | 'light'
  setTheme: (theme: 'dark' | 'light') => void
  toggleTheme: () => void

  // Presentation & Fullscreen
  presentationTheme: PresentationTheme
  setPresentationTheme: (theme: PresentationTheme) => void
  fullscreenMode: boolean
  setFullscreenMode: (fullscreen: boolean) => void

  // Active Drag State for DragOverlay
  activeDragId: string | null
  setActiveDragId: (id: string | null) => void

  // Metadata
  title: string
  subtitle: string
  author: string
  selectedTemplateId: string

  // Core Data
  tiers: Tier[]
  items: TierItem[]
  containers: TierListContainers

  // View / UI Controls
  itemSize: ItemSize
  previewMode: boolean
  searchQuery: string
  selectedCategory: string | null

  // History for Undo/Redo
  history: TierListHistoryState[]
  future: TierListHistoryState[]

  // Modals & UI Triggers
  isAddItemOpen: boolean
  isExportOpen: boolean
  isTemplateOpen: boolean
  isRandomPickerOpen: boolean
  isEditMetadataOpen: boolean

  // Actions - Modals
  setAddItemOpen: (open: boolean) => void
  setExportOpen: (open: boolean) => void
  setTemplateOpen: (open: boolean) => void
  setRandomPickerOpen: (open: boolean) => void
  setEditMetadataOpen: (open: boolean) => void

  // Actions - Metadata
  setTitle: (title: string) => void
  setSubtitle: (subtitle: string) => void
  setAuthor: (author: string) => void
  updateMetadata: (meta: { title: string; subtitle: string; author: string }) => void

  // Actions - View
  setItemSize: (size: ItemSize) => void
  setPreviewMode: (previewMode: boolean) => void
  setSearchQuery: (query: string) => void
  setSelectedCategory: (category: string | null) => void

  // Actions - Templates
  loadTemplate: (templateId: string) => void
  resetCurrentTemplate: () => void

  // Actions - Tiers
  addTier: (position?: 'top' | 'bottom') => void
  updateTier: (id: string, updates: Partial<Tier>) => void
  deleteTier: (id: string) => void
  moveTier: (id: string, direction: 'up' | 'down') => void
  clearTier: (id: string) => void
  clearAllTiers: () => void

  // Actions - Items
  addItem: (item: { title: string; imageUrl?: string; category?: string; subtitle?: string }, targetContainerId?: string) => void
  updateItem: (id: string, updates: Partial<TierItem>) => void
  deleteItem: (id: string) => void
  moveItemToTier: (itemId: string, targetTierId: string) => void
  shufflePool: () => void
  resetAllToPool: () => void
  bulkAddItems: (itemsList: Array<{ title: string; imageUrl?: string; category?: string }>) => void

  // DnD Container updater
  setContainers: (containersOrUpdater: TierListContainers | ((prev: TierListContainers) => TierListContainers)) => void

  // Undo / Redo
  undo: () => void
  redo: () => void
  canUndo: () => boolean
  canRedo: () => boolean

  // JSON Import
  importConfig: (data: Partial<TemplateData>) => void
}

const defaultTemplate = TEMPLATES[0]

function createHistorySnapshot(state: {
  title: string
  subtitle: string
  author: string
  tiers: Tier[]
  items: TierItem[]
  containers: TierListContainers
}): TierListHistoryState {
  return {
    title: state.title,
    subtitle: state.subtitle,
    author: state.author,
    tiers: JSON.parse(JSON.stringify(state.tiers)),
    items: JSON.parse(JSON.stringify(state.items)),
    containers: JSON.parse(JSON.stringify(state.containers)),
  }
}

function applyThemeToDocument(theme: 'dark' | 'light') {
  if (typeof document !== 'undefined') {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
      root.classList.remove('light')
    } else {
      root.classList.add('light')
      root.classList.remove('dark')
    }
  }
}

export const useTierListStore = create<TierListState>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      setTheme: (theme) => {
        applyThemeToDocument(theme)
        set({ theme })
      },
      toggleTheme: () => {
        const nextTheme = get().theme === 'dark' ? 'light' : 'dark'
        applyThemeToDocument(nextTheme)
        set({ theme: nextTheme })
      },

      presentationTheme: 'studio',
      setPresentationTheme: (presentationTheme) => set({ presentationTheme }),
      fullscreenMode: false,
      setFullscreenMode: (fullscreenMode) => set({ fullscreenMode }),

      activeDragId: null,
      setActiveDragId: (activeDragId) => set({ activeDragId }),

      title: defaultTemplate.title,
      subtitle: defaultTemplate.subtitle,
      author: defaultTemplate.author,
      selectedTemplateId: defaultTemplate.id,
      tiers: defaultTemplate.tiers,
      items: defaultTemplate.items,
      containers: defaultTemplate.containers,

      itemSize: 'normal',
      previewMode: false,
      searchQuery: '',
      selectedCategory: null,

      history: [],
      future: [],

      isAddItemOpen: false,
      isExportOpen: false,
      isTemplateOpen: false,
      isRandomPickerOpen: false,
      isEditMetadataOpen: false,

      setAddItemOpen: (open) => set({ isAddItemOpen: open }),
      setExportOpen: (open) => set({ isExportOpen: open }),
      setTemplateOpen: (open) => set({ isTemplateOpen: open }),
      setRandomPickerOpen: (open) => set({ isRandomPickerOpen: open }),
      setEditMetadataOpen: (open) => set({ isEditMetadataOpen: open }),

      setTitle: (title) => {
        const snap = createHistorySnapshot(get())
        set((state) => ({
          title,
          history: [...state.history.slice(-20), snap],
          future: [],
        }))
      },

      setSubtitle: (subtitle) => {
        const snap = createHistorySnapshot(get())
        set((state) => ({
          subtitle,
          history: [...state.history.slice(-20), snap],
          future: [],
        }))
      },

      setAuthor: (author) => {
        const snap = createHistorySnapshot(get())
        set((state) => ({
          author,
          history: [...state.history.slice(-20), snap],
          future: [],
        }))
      },

      updateMetadata: ({ title, subtitle, author }) => {
        const snap = createHistorySnapshot(get())
        set((state) => ({
          title,
          subtitle,
          author,
          history: [...state.history.slice(-20), snap],
          future: [],
        }))
      },

      setItemSize: (itemSize) => set({ itemSize }),
      setPreviewMode: (previewMode) => set({ previewMode }),
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setSelectedCategory: (selectedCategory) => set({ selectedCategory }),

      loadTemplate: (templateId) => {
        const template = TEMPLATES.find((t) => t.id === templateId) || TEMPLATES[0]
        const snap = createHistorySnapshot(get())
        set((state) => ({
          selectedTemplateId: template.id,
          title: template.title,
          subtitle: template.subtitle,
          author: template.author,
          tiers: JSON.parse(JSON.stringify(template.tiers)),
          items: JSON.parse(JSON.stringify(template.items)),
          containers: JSON.parse(JSON.stringify(template.containers)),
          searchQuery: '',
          selectedCategory: null,
          history: [...state.history.slice(-20), snap],
          future: [],
        }))
      },

      resetCurrentTemplate: () => {
        const currentId = get().selectedTemplateId
        get().loadTemplate(currentId)
      },

      addTier: (position = 'bottom') => {
        const snap = createHistorySnapshot(get())
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

        const newTiers = position === 'top' ? [newTier, ...currentTiers] : [...currentTiers, newTier]
        const newContainers = {
          ...get().containers,
          [newTierId]: [],
        }

        set((state) => ({
          tiers: newTiers,
          containers: newContainers,
          history: [...state.history.slice(-20), snap],
          future: [],
        }))
      },

      updateTier: (id, updates) => {
        const snap = createHistorySnapshot(get())
        set((state) => ({
          tiers: state.tiers.map((t) => (t.id === id ? { ...t, ...updates } : t)),
          history: [...state.history.slice(-20), snap],
          future: [],
        }))
      },

      deleteTier: (id) => {
        const snap = createHistorySnapshot(get())
        const state = get()
        const tierItems = state.containers[id] || []
        const poolItems = state.containers['POOL'] || []

        const newContainers = { ...state.containers }
        delete newContainers[id]
        newContainers['POOL'] = [...poolItems, ...tierItems]

        set({
          tiers: state.tiers.filter((t) => t.id !== id),
          containers: newContainers,
          history: [...state.history.slice(-20), snap],
          future: [],
        })
      },

      moveTier: (id, direction) => {
        const snap = createHistorySnapshot(get())
        const currentTiers = [...get().tiers]
        const index = currentTiers.findIndex((t) => t.id === id)
        if (index === -1) return
        if (direction === 'up' && index === 0) return
        if (direction === 'down' && index === currentTiers.length - 1) return

        const targetIndex = direction === 'up' ? index - 1 : index + 1
        const [moved] = currentTiers.splice(index, 1)
        currentTiers.splice(targetIndex, 0, moved)

        set((state) => ({
          tiers: currentTiers,
          history: [...state.history.slice(-20), snap],
          future: [],
        }))
      },

      clearTier: (id) => {
        const snap = createHistorySnapshot(get())
        const state = get()
        const tierItems = state.containers[id] || []
        if (tierItems.length === 0) return

        const poolItems = state.containers['POOL'] || []
        set({
          containers: {
            ...state.containers,
            [id]: [],
            POOL: [...poolItems, ...tierItems],
          },
          history: [...state.history.slice(-20), snap],
          future: [],
        })
      },

      clearAllTiers: () => {
        get().resetAllToPool()
      },

      addItem: (itemData, targetContainerId = 'POOL') => {
        const snap = createHistorySnapshot(get())
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
          history: [...state.history.slice(-20), snap],
          future: [],
        })
      },

      updateItem: (id, updates) => {
        const snap = createHistorySnapshot(get())
        set((state) => ({
          items: state.items.map((i) => (i.id === id ? { ...i, ...updates } : i)),
          history: [...state.history.slice(-20), snap],
          future: [],
        }))
      },

      deleteItem: (id) => {
        const snap = createHistorySnapshot(get())
        const state = get()
        const newContainers: TierListContainers = {}

        for (const [cId, itemIds] of Object.entries(state.containers)) {
          newContainers[cId] = itemIds.filter((itemId) => itemId !== id)
        }

        set({
          items: state.items.filter((i) => i.id !== id),
          containers: newContainers,
          history: [...state.history.slice(-20), snap],
          future: [],
        })
      },

      moveItemToTier: (itemId, targetTierId) => {
        const snap = createHistorySnapshot(get())
        const state = get()
        const currentContainers = { ...state.containers }

        // Remove from whichever container currently holds it
        for (const cId of Object.keys(currentContainers)) {
          currentContainers[cId] = currentContainers[cId].filter((id) => id !== itemId)
        }

        // Add to target container
        currentContainers[targetTierId] = [...(currentContainers[targetTierId] || []), itemId]

        set({
          containers: currentContainers,
          history: [...state.history.slice(-20), snap],
          future: [],
        })
      },

      shufflePool: () => {
        const snap = createHistorySnapshot(get())
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
          history: [...state.history.slice(-20), snap],
          future: [],
        })
      },

      resetAllToPool: () => {
        const snap = createHistorySnapshot(get())
        const state = get()
        const allItemIds = state.items.map((i) => i.id)
        const emptyContainers: TierListContainers = { POOL: allItemIds }

        for (const tier of state.tiers) {
          emptyContainers[tier.id] = []
        }

        set({
          containers: emptyContainers,
          history: [...state.history.slice(-20), snap],
          future: [],
        })
      },

      bulkAddItems: (itemsList) => {
        if (!itemsList.length) return
        const snap = createHistorySnapshot(get())
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
          history: [...state.history.slice(-20), snap],
          future: [],
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

      undo: () => {
        const { history, future } = get()
        if (history.length === 0) return

        const previous = history[history.length - 1]
        const newHistory = history.slice(0, -1)
        const currentSnap = createHistorySnapshot(get())

        set({
          title: previous.title,
          subtitle: previous.subtitle,
          author: previous.author,
          tiers: previous.tiers,
          items: previous.items,
          containers: previous.containers,
          history: newHistory,
          future: [currentSnap, ...future.slice(0, 20)],
        })
      },

      redo: () => {
        const { history, future } = get()
        if (future.length === 0) return

        const next = future[0]
        const newFuture = future.slice(1)
        const currentSnap = createHistorySnapshot(get())

        set({
          title: next.title,
          subtitle: next.subtitle,
          author: next.author,
          tiers: next.tiers,
          items: next.items,
          containers: next.containers,
          history: [...history.slice(-20), currentSnap],
          future: newFuture,
        })
      },

      canUndo: () => get().history.length > 0,
      canRedo: () => get().future.length > 0,

      importConfig: (data) => {
        const snap = createHistorySnapshot(get())
        set((state) => ({
          title: data.title || state.title,
          subtitle: data.subtitle || state.subtitle,
          author: data.author || state.author,
          tiers: data.tiers || state.tiers,
          items: data.items || state.items,
          containers: data.containers || state.containers,
          history: [...state.history.slice(-20), snap],
          future: [],
        }))
      },
    }),
    {
      name: 'tier-list-maker-live-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        theme: state.theme,
        presentationTheme: state.presentationTheme,
        title: state.title,
        subtitle: state.subtitle,
        author: state.author,
        selectedTemplateId: state.selectedTemplateId,
        tiers: state.tiers,
        items: state.items,
        containers: state.containers,
        itemSize: state.itemSize,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.theme) {
          applyThemeToDocument(state.theme)
        }
      },
    },
  ),
)
