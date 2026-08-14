import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { ItemSize } from '../lib/types'

export type PresentationTheme = 'studio' | 'neon' | 'slate' | 'noir' | 'clean'

export interface UiState {
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

  // View / UI Controls
  itemSize: ItemSize
  setItemSize: (size: ItemSize) => void
  previewMode: boolean
  setPreviewMode: (previewMode: boolean) => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  selectedCategory: string | null
  setSelectedCategory: (category: string | null) => void

  // Modals & UI Triggers
  isAddItemOpen: boolean
  isExportOpen: boolean
  isTemplateOpen: boolean
  isRandomPickerOpen: boolean
  isEditMetadataOpen: boolean
  setAddItemOpen: (open: boolean) => void
  setExportOpen: (open: boolean) => void
  setTemplateOpen: (open: boolean) => void
  setRandomPickerOpen: (open: boolean) => void
  setEditMetadataOpen: (open: boolean) => void
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

export const useUiStore = create<UiState>()(
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

      itemSize: 'normal',
      setItemSize: (itemSize) => set({ itemSize }),
      previewMode: false,
      setPreviewMode: (previewMode) => set({ previewMode }),
      searchQuery: '',
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      selectedCategory: null,
      setSelectedCategory: (selectedCategory) => set({ selectedCategory }),

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
    }),
    {
      name: 'tier-list-ui-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        theme: state.theme,
        presentationTheme: state.presentationTheme,
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
