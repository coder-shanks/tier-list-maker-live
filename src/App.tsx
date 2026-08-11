import { useEffect } from 'react'
import { DragDropProvider, DragOverlay } from '@dnd-kit/react'
import { move } from '@dnd-kit/helpers'
import { useTierListStore } from './store/useTierListStore'
import Navbar from './components/Navbar'
import TierList from './components/TierList'
import ItemsList from './components/ItemsList'
import AddItemModal from './components/AddItemModal'
import ExportModal from './components/ExportModal'
import TemplateSelectorModal from './components/TemplateSelectorModal'
import RandomPickerModal from './components/RandomPickerModal'
import FullscreenView from './components/FullscreenView'
import DraggableItem from './components/DraggableItem'
import { TooltipProvider } from './components/ui/tooltip'

export default function App() {
  const {
    theme,
    items,
    activeDragId,
    setActiveDragId,
    setContainers,
    undo,
    redo,
    setExportOpen,
    setAddItemOpen,
    setRandomPickerOpen,
    previewMode,
    setPreviewMode,
    fullscreenMode,
    setFullscreenMode,
  } = useTierListStore()

  // Sync theme class on document element
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
      root.classList.remove('light')
    } else {
      root.classList.add('light')
      root.classList.remove('dark')
    }
  }, [theme])

  // Active dragged item for DragOverlay
  const activeItem = items.find((it) => it.id === activeDragId)

  // Global Keyboard Shortcuts (F, P, Esc, Cmd+Z, Cmd+Y, Cmd+E, N, R)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore when typing inside input / textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') {
        if (e.shiftKey) {
          e.preventDefault()
          redo()
        } else {
          e.preventDefault()
          undo()
        }
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault()
        redo()
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'e') {
        e.preventDefault()
        setExportOpen(true)
      } else if (e.key.toLowerCase() === 'f' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault()
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {})
          setFullscreenMode(true)
        } else {
          document.exitFullscreen().catch(() => {})
          setFullscreenMode(false)
          setPreviewMode(false)
        }
      } else if (e.key.toLowerCase() === 'p' && !e.metaKey && !e.ctrlKey) {
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
      } else if (e.key.toLowerCase() === 'n' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault()
        setAddItemOpen(true)
      } else if (e.key.toLowerCase() === 'r' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault()
        setRandomPickerOpen(true)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [undo, redo, setExportOpen, setAddItemOpen, setRandomPickerOpen, previewMode, setPreviewMode, fullscreenMode, setFullscreenMode])

  // Background style classes
  const pageBgClass = theme === 'dark' ? 'studio-grid-dark' : 'studio-grid-light'

  return (
    <TooltipProvider delay={0}>
      <DragDropProvider
        onDragStart={(event) => {
          const sourceId = event.operation?.source?.id as string | undefined
          if (sourceId) {
            setActiveDragId(sourceId)
          }
        }}
        onDragEnd={(event) => {
          setActiveDragId(null)
          if (event.canceled) return
          setContainers((prevContainers) => move(prevContainers, event))
        }}
      >
        <div
          className={`min-h-screen ${pageBgClass} text-foreground flex flex-col font-sans antialiased transition-colors duration-200 relative`}
        >
          {/* Top Navbar Studio Bar */}
          {!fullscreenMode && <Navbar />}

          {/* Main Canvas Area */}
          <main
            className={`flex-1 px-3 sm:px-6 max-w-7xl w-full mx-auto space-y-4 sm:space-y-6 transition-all duration-200 ${
              fullscreenMode ? 'py-6 sm:py-10' : 'py-4 sm:py-6'
            }`}
          >
            {/* Main Tier Canvas */}
            <TierList />

            {/* Unassigned Item Vault Dock */}
            <ItemsList />
          </main>

          {/* Drag Overlay: Tactile elevated rank card */}
          <DragOverlay>
            {activeItem ? (
              <DraggableItem
                item={activeItem}
                isOverlay
              />
            ) : null}
          </DragOverlay>

          {/* Presentation HUD View */}
          <FullscreenView />

          {/* Architectural Footer with Key Shortcuts */}
          {!previewMode && !fullscreenMode && (
            <footer className="py-5 border-t border-border/80 text-center text-xs text-muted-foreground space-y-1.5 transition-colors">
              <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] font-mono">
                <span className="text-foreground font-semibold">Shortcuts:</span>
                <span className="inline-flex items-center gap-1"><kbd className="px-1.5 py-0.5 rounded bg-secondary text-foreground border border-border">⌘Z</kbd> Undo</span>
                <span>•</span>
                <span className="inline-flex items-center gap-1"><kbd className="px-1.5 py-0.5 rounded bg-secondary text-foreground border border-border">⌘Y</kbd> Redo</span>
                <span>•</span>
                <span className="inline-flex items-center gap-1"><kbd className="px-1.5 py-0.5 rounded bg-secondary text-foreground border border-border">F</kbd> Fullscreen</span>
                <span>•</span>
                <span className="inline-flex items-center gap-1"><kbd className="px-1.5 py-0.5 rounded bg-secondary text-foreground border border-border">P</kbd> Present</span>
                <span>•</span>
                <span className="inline-flex items-center gap-1"><kbd className="px-1.5 py-0.5 rounded bg-secondary text-foreground border border-border">N</kbd> New Item</span>
                <span>•</span>
                <span className="inline-flex items-center gap-1"><kbd className="px-1.5 py-0.5 rounded bg-secondary text-foreground border border-border">R</kbd> Roulette</span>
                <span>•</span>
                <span className="inline-flex items-center gap-1"><kbd className="px-1.5 py-0.5 rounded bg-secondary text-foreground border border-border">⌘E</kbd> Export</span>
              </div>
            </footer>
          )}

          {/* Global Action Modals */}
          <AddItemModal />
          <ExportModal />
          <TemplateSelectorModal />
          <RandomPickerModal />
        </div>
      </DragDropProvider>
    </TooltipProvider>
  )
}
