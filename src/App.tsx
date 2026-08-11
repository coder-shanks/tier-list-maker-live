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
    presentationTheme,
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

  // Global Keyboard Shortcuts (F for Fullscreen, P for Preview, Esc for exit, Cmd+Z, Cmd+Y, Cmd+E, N, R)
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
        // 'f' for fullscreen
        e.preventDefault()
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {})
          setFullscreenMode(true)
        } else {
          document.exitFullscreen().catch(() => {})
          setFullscreenMode(false)
        }
      } else if (e.key.toLowerCase() === 'p' && !e.metaKey && !e.ctrlKey) {
        // 'p' for preview mode
        e.preventDefault()
        setPreviewMode(!previewMode)
      } else if (e.key === 'Escape') {
        if (previewMode) setPreviewMode(false)
        if (fullscreenMode) {
          if (document.fullscreenElement) document.exitFullscreen().catch(() => {})
          setFullscreenMode(false)
        }
      } else if (e.key.toLowerCase() === 'n' && !e.metaKey && !e.ctrlKey) {
        // 'n' for new custom item
        e.preventDefault()
        setAddItemOpen(true)
      } else if (e.key.toLowerCase() === 'r' && !e.metaKey && !e.ctrlKey) {
        // 'r' for roulette
        e.preventDefault()
        setRandomPickerOpen(true)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [undo, redo, setExportOpen, setAddItemOpen, setRandomPickerOpen, previewMode, setPreviewMode, fullscreenMode, setFullscreenMode])

  // Theme container classes
  const pageBgClasses = {
    studio: 'bg-zinc-50 dark:bg-zinc-950',
    neon: 'bg-zinc-950 dark:bg-black bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950/40 via-zinc-950 to-black',
    slate: 'bg-slate-50 dark:bg-slate-950',
    noir: 'bg-stone-50 dark:bg-stone-950',
    clean: 'bg-zinc-50 dark:bg-zinc-950',
  }[presentationTheme]

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
          className={`min-h-screen ${pageBgClasses} text-zinc-900 dark:text-zinc-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white antialiased transition-colors duration-300 relative`}
        >
          {/* Top Navbar Toolbar (Hidden in Fullscreen presentation mode if desired or kept clean) */}
          {!fullscreenMode && <Navbar />}

          {/* Main Workspace Area */}
          <main
            className={`flex-1 px-3 sm:px-6 max-w-7xl w-full mx-auto space-y-6 transition-all duration-300 ${
              fullscreenMode ? 'py-8 sm:py-12' : 'py-6 sm:py-8'
            }`}
          >
            {/* Main Tier Canvas */}
            <TierList />

            {/* Unassigned Items Pool Dock */}
            <ItemsList />
          </main>

          {/* Drag Overlay: Renders tactile floating item card while dragging */}
          <DragOverlay>
            {activeItem ? (
              <DraggableItem
                item={activeItem}
                isOverlay
              />
            ) : null}
          </DragOverlay>

          {/* Floating Presentation / Fullscreen Controls Dock */}
          <FullscreenView />

          {/* Footer info (Hidden in Preview & Fullscreen Mode) */}
          {!previewMode && !fullscreenMode && (
            <footer className="py-6 border-t border-zinc-200 dark:border-zinc-900 text-center text-xs text-zinc-500 dark:text-zinc-500 space-y-1.5 transition-colors">
              <p className="font-medium">
                Live Tier List Maker • 100% Free & Open-Source Community Tool
              </p>
              <div className="flex flex-wrap items-center justify-center gap-1.5 text-[11px] text-zinc-400 dark:text-zinc-500">
                <span>Shortcuts:</span>
                <kbd className="px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 font-mono">⌘/Ctrl+Z</kbd> Undo
                <span>•</span>
                <kbd className="px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 font-mono">⌘/Ctrl+Y</kbd> Redo
                <span>•</span>
                <kbd className="px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 font-mono">F</kbd> Fullscreen
                <span>•</span>
                <kbd className="px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 font-mono">P</kbd> Preview
                <span>•</span>
                <kbd className="px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 font-mono">N</kbd> New Item
                <span>•</span>
                <kbd className="px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 font-mono">R</kbd> Roulette
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
