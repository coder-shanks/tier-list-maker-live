import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type {
  BlindChallengeConfig,
  BlindChallengeHistoryEntry,
  BlindChallengeMode,
} from '../lib/types'
import { useTierDataStore } from './useTierDataStore'
import { useUiStore } from './useUiStore'

export interface BlindStoreState {
  isActive: boolean
  mode: BlindChallengeMode
  queue: string[]
  currentItemId: string | null
  lockedItemIds: string[]
  tierCaps: Record<string, number>
  history: BlindChallengeHistoryEntry[]
  startedAt: number | null
  completedAt: number | null
  totalItems: number
  lastConfig: BlindChallengeConfig | null

  // Actions
  startBlindChallenge: (config: BlindChallengeConfig) => void
  assignBlindCurrentItem: (targetTierId: string) => boolean
  stopBlindChallenge: (keepPlacements?: boolean) => void
  restartBlindChallenge: () => void
  unlockBoard: () => void
}

export const useBlindStore = create<BlindStoreState>()(
  persist(
    (set, get) => ({
      isActive: false,
      mode: 'standard',
      queue: [],
      currentItemId: null,
      lockedItemIds: [],
      tierCaps: {},
      history: [],
      startedAt: null,
      completedAt: null,
      totalItems: 0,
      lastConfig: null,

      startBlindChallenge: (config: BlindChallengeConfig) => {
        const tierStore = useTierDataStore.getState()

        // Optionally reset entire board back to vault pool
        if (config.resetBoardFirst) {
          tierStore.resetAllToPool()
        }

        // Get pool items
        let pool = [...(useTierDataStore.getState().containers['POOL'] || [])]
        if (pool.length === 0) {
          tierStore.resetAllToPool()
          pool = [...(useTierDataStore.getState().containers['POOL'] || [])]
        }

        // Fisher-Yates shuffle
        for (let i = pool.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1))
          ;[pool[i], pool[j]] = [pool[j], pool[i]]
        }

        const firstItem = pool[0] || null
        const restQueue = pool.slice(1)

        set({
          isActive: true,
          mode: config.mode,
          queue: restQueue,
          currentItemId: firstItem,
          lockedItemIds: [],
          tierCaps: config.tierCaps || {},
          history: [],
          startedAt: Date.now(),
          completedAt: null,
          totalItems: pool.length,
          lastConfig: config,
        })

        // Close setup modal
        useUiStore.getState().setBlindSetupOpen(false)
        useUiStore.getState().setBlindSummaryOpen(false)
      },

      assignBlindCurrentItem: (targetTierId: string) => {
        const { isActive, currentItemId, mode, tierCaps, queue, lockedItemIds, history } =
          get()
        if (!isActive || !currentItemId) return false

        const tierStore = useTierDataStore.getState()

        // Validate targetTierId is a real tier
        const targetTier = tierStore.tiers.find((t) => t.id === targetTierId)
        if (!targetTier) return false

        // Validate hardcore mode tier capacity
        if (mode === 'hardcore') {
          const currentCount = (tierStore.containers[targetTierId] || []).length
          const cap = tierCaps[targetTierId]
          if (cap !== undefined && currentCount >= cap) {
            return false
          }
        }

        // Move item to target tier
        tierStore.moveItemToTier(currentItemId, targetTierId)

        const nextLocked = [...lockedItemIds, currentItemId]
        const nextHistory: BlindChallengeHistoryEntry[] = [
          ...history,
          { itemId: currentItemId, tierId: targetTierId, timestamp: Date.now() },
        ]

        const nextItemId = queue[0] || null
        const nextQueue = queue.slice(1)

        if (!nextItemId) {
          // Challenge completed!
          set({
            currentItemId: null,
            queue: [],
            lockedItemIds: nextLocked,
            history: nextHistory,
            completedAt: Date.now(),
          })
          useUiStore.getState().setBlindSummaryOpen(true)
        } else {
          set({
            currentItemId: nextItemId,
            queue: nextQueue,
            lockedItemIds: nextLocked,
            history: nextHistory,
          })
        }

        return true
      },

      stopBlindChallenge: (keepPlacements = true) => {
        if (!keepPlacements) {
          useTierDataStore.getState().resetAllToPool()
        }

        set({
          isActive: false,
          currentItemId: null,
          queue: [],
          lockedItemIds: [],
          history: [],
          startedAt: null,
          completedAt: null,
        })

        useUiStore.getState().setBlindSummaryOpen(false)
      },

      restartBlindChallenge: () => {
        const { lastConfig } = get()
        if (lastConfig) {
          get().startBlindChallenge(lastConfig)
        } else {
          get().startBlindChallenge({
            mode: 'standard',
            tierCaps: {},
            resetBoardFirst: true,
          })
        }
      },

      unlockBoard: () => {
        set({
          isActive: false,
          lockedItemIds: [],
        })
        useUiStore.getState().setBlindSummaryOpen(false)
      },
    }),
    {
      name: 'tier-list-blind-challenge-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        isActive: state.isActive,
        mode: state.mode,
        queue: state.queue,
        currentItemId: state.currentItemId,
        lockedItemIds: state.lockedItemIds,
        tierCaps: state.tierCaps,
        history: state.history,
        startedAt: state.startedAt,
        completedAt: state.completedAt,
        totalItems: state.totalItems,
        lastConfig: state.lastConfig,
      }),
    },
  ),
)
