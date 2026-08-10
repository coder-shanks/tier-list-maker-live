import { useEffect } from 'react'
import { DragDropProvider } from '@dnd-kit/react'
import { move } from '@dnd-kit/helpers'
import { useTierListStore } from './store/useTierListStore'
import Navbar from './components/Navbar'
import TierList from './components/TierList'
import ItemsList from './components/ItemsList'
import AddItemModal from './components/AddItemModal'
import ExportModal from './components/ExportModal'
import TemplateSelectorModal from './components/TemplateSelectorModal'
import RandomPickerModal from './components/RandomPickerModal'
import { TooltipProvider } from './components/ui/tooltip'

export default function App() {
  const {
    theme,
    setContainers,
    undo,
    redo,
    setExportOpen,
    setAddItemOpen,
    setRandomPickerOpen,
    previewMode,
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

  // Global Keyboard Shortcuts (Ctrl+Z / Cmd+Z, Ctrl+Y / Cmd+Y, Ctrl+E for Export, etc.)
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
      } else if (e.key === 'n' && !e.metaKey && !e.ctrlKey) {
        // 'n' for new custom item
        e.preventDefault()
        setAddItemOpen(true)
      } else if (e.key === 'r' && !e.metaKey && !e.ctrlKey) {
        // 'r' for roulette
        e.preventDefault()
        setRandomPickerOpen(true)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [undo, redo, setExportOpen, setAddItemOpen, setRandomPickerOpen])

  return (
    <TooltipProvider delay={0}>
      <DragDropProvider
        onDragEnd={(event) => {
          if (event.canceled) return
          setContainers((prevContainers) => move(prevContainers, event))
        }}
      >
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white antialiased transition-colors duration-200">
          {/* Top Navbar Toolbar */}
          <Navbar />

          {/* Main Workspace Area */}
          <main className="flex-1 px-3 sm:px-6 py-6 sm:py-8 max-w-7xl w-full mx-auto space-y-6">
            {/* Main Tier Canvas */}
            <TierList />

            {/* Unassigned Items Pool Dock */}
            <ItemsList />
          </main>

          {/* Footer info (Hidden in Preview Mode) */}
          {!previewMode && (
            <footer className="py-6 border-t border-zinc-200 dark:border-zinc-900 text-center text-xs text-zinc-500 dark:text-zinc-500 space-y-1 transition-colors">
              <p>
                Live Tier List Maker • Built with React, TypeScript, Zustand, and Tailwind CSS.
              </p>
              <p className="text-[11px] text-zinc-400 dark:text-zinc-600">
                Shortcuts: <kbd className="px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-400 font-mono">⌘/Ctrl+Z</kbd> Undo • <kbd className="px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-400 font-mono">⌘/Ctrl+Y</kbd> Redo • <kbd className="px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-400 font-mono">N</kbd> New Item • <kbd className="px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-400 font-mono">R</kbd> Roulette
              </p>
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
