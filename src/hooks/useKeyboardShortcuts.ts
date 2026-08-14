import { useEffect } from 'react'
import { useUiStore } from '../store/useUiStore'
import { performUndo, performRedo } from '../store/useTierDataStore'

export function useKeyboardShortcuts() {
  const setExportOpen = useUiStore((s) => s.setExportOpen)
  const setAddItemOpen = useUiStore((s) => s.setAddItemOpen)
  const setRandomPickerOpen = useUiStore((s) => s.setRandomPickerOpen)
  const previewMode = useUiStore((s) => s.previewMode)
  const setPreviewMode = useUiStore((s) => s.setPreviewMode)
  const fullscreenMode = useUiStore((s) => s.fullscreenMode)
  const setFullscreenMode = useUiStore((s) => s.setFullscreenMode)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore typing inside inputs, textareas, or select dropdowns
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return
      }

      const key = e.key.toLowerCase()

      if ((e.metaKey || e.ctrlKey) && key === 'z') {
        e.preventDefault()
        if (e.shiftKey) {
          performRedo()
        } else {
          performUndo()
        }
      } else if ((e.metaKey || e.ctrlKey) && key === 'y') {
        e.preventDefault()
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
        e.preventDefault()
        setAddItemOpen(true)
      } else if (key === 'r' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault()
        setRandomPickerOpen(true)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [
    setExportOpen,
    setAddItemOpen,
    setRandomPickerOpen,
    previewMode,
    setPreviewMode,
    fullscreenMode,
    setFullscreenMode,
  ])
}
