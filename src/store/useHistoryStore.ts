import { create } from 'zustand'
import type { TierListHistoryState } from '../lib/types'

export interface HistoryState {
  history: TierListHistoryState[]
  future: TierListHistoryState[]
  pushSnapshot: (snapshot: TierListHistoryState) => void
  popUndo: () => TierListHistoryState | null
  popRedo: () => TierListHistoryState | null
  canUndo: () => boolean
  canRedo: () => boolean
}

export const useHistoryStore = create<HistoryState>()((set, get) => ({
  history: [],
  future: [],

  pushSnapshot: (snapshot) =>
    set((state) => ({
      history: [...state.history.slice(-20), snapshot],
      future: [],
    })),

  popUndo: () => {
    const { history } = get()
    if (history.length === 0) return null
    const previous = history[history.length - 1]
    set((state) => ({
      history: state.history.slice(0, -1),
    }))
    return previous
  },

  popRedo: () => {
    const { future } = get()
    if (future.length === 0) return null
    const next = future[0]
    set((state) => ({
      future: state.future.slice(1),
    }))
    return next
  },

  canUndo: () => get().history.length > 0,
  canRedo: () => get().future.length > 0,
}))
