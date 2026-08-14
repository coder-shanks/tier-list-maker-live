import { useEffect } from 'react'
import { useUiStore } from '../store/useUiStore'
import { useBlindStore } from '../store/useBlindStore'
import { performUndo, performRedo } from '../store/useTierDataStore'

export function useKeyboardShortcuts() {
  const setExportOpen = useUiStore((s) => s.setExportOpen)
  const setAddItemOpen = useUiStore((s) => s.setAddItemOpen)
  const isRandomPickerOpen = useUiStore((s) => s.isRandomPickerOpen)
  const setRandomPickerOpen = useUiStore((s) => s.setRandomPickerOpen)
  const previewMode = useUiStore((s) => s.previewMode)
  const setPreviewMode = useUiStore((s) => s.setPreviewMode)
  const fullscreenMode = useUiStore((s) => s.fullscreenMode)
  const setFullscreenMode = useUiStore((s) => s.setFullscreenMode)
  const isBlindSetupOpen = useUiStore((s) => s.isBlindSetupOpen)
  const setBlindSetupOpen = useUiStore((s) => s.setBlindSetupOpen)

  const isBlindActive = useBlindStore((s) => s.isActive)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore typing inside inputs, textareas, or select dropdowns
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return
      }

      const key = e.key.toLowerCase()

      // Undo / Redo (Disabled during active blind challenge)
      if ((e.metaKey || e.ctrlKey) && key === 'z') {
        e.preventDefault()
        if (isBlindActive) return
        if (e.shiftKey) {
          performRedo()
        } else {
          performUndo()
        }
      } else if ((e.metaKey || e.ctrlKey) && key === 'y') {
        e.preventDefault()
        if (isBlindActive) return
        performRedo()
      } else if ((e.metaKey || e.ctrlKey) && key === 'e') {
        e.preventDefault()
        setExportOpen(true)
      } else if (key === 'f' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault()
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {})
          setFullscreenMode(true)
        } else {
          document.exitFullscreen().catch(() => {})
          setFullscreenMode(false)
          setPreviewMode(false)
        }
      } else if (key === 'p' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault()
        if (previewMode) {
          setPreviewMode(false)
          setFullscreenMode(false)
          if (document.fullscreenElement) document.exitFullscreen().catch(() => {})
        } else {
          setPreviewMode(true)
        }
      } else if (e.key === 'Escape') {
        setPreviewMode(false)
        setFullscreenMode(false)
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => {})
        }
      } else if (key === 'n' && !e.metaKey && !e.ctrlKey) {
        // Disabled during active blind challenge
        if (isBlindActive) return
        e.preventDefault()
        setAddItemOpen(true)
      } else if (key === 'r' && !e.metaKey && !e.ctrlKey) {
        // Disabled during active blind challenge
        if (isBlindActive) return
        e.preventDefault()
        setRandomPickerOpen(true)
      } else if (key === 'b' && !e.metaKey && !e.ctrlKey) {
        // Disabled if roulette is currently open
        if (isRandomPickerOpen) return
        e.preventDefault()
        setBlindSetupOpen(true)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [
    setExportOpen,
    setAddItemOpen,
    setRandomPickerOpen,
    setBlindSetupOpen,
    previewMode,
    setPreviewMode,
    fullscreenMode,
    setFullscreenMode,
    isBlindActive,
    isRandomPickerOpen,
    isBlindSetupOpen,
  ])
}
