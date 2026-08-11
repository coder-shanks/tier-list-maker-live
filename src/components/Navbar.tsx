import { useEffect } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  SparklesIcon,
  Undo02Icon,
  Redo02Icon,
  Download01Icon,
  EyeIcon,
  EyeOffIcon,
  Sun01Icon,
  Moon02Icon,
  RadioIcon,
  FullScreenIcon,
  MinimizeScreenIcon,
} from '@hugeicons/core-free-icons'
import { useTierListStore } from '../store/useTierListStore'
import { TEMPLATES } from '../lib/constants'
import type { ItemSize } from '../lib/types'
import { SimpleTooltip } from './ui/tooltip'
import { Button } from './ui/button'
import { Badge } from './ui/badge'

export default function Navbar() {
  const {
    selectedTemplateId,
    itemSize,
    previewMode,
    fullscreenMode,
    setFullscreenMode,
    theme,
    toggleTheme,
    canUndo,
    canRedo,
    undo,
    redo,
    setItemSize,
    setPreviewMode,
    setTemplateOpen,
    setExportOpen,
  } = useTierListStore()

  const currentTemplate =
    TEMPLATES.find((t) => t.id === selectedTemplateId) || TEMPLATES[0]

  const sizeOptions: { size: ItemSize; label: string; tooltip: string }[] = [
    { size: 'compact', label: 'S', tooltip: 'Small Cards (64px)' },
    { size: 'normal', label: 'M', tooltip: 'Medium Cards (80px)' },
    { size: 'large', label: 'L', tooltip: 'Large Cards (96px)' },
  ]

  const toggleBrowserFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen()
        setFullscreenMode(true)
      } else {
        await document.exitFullscreen()
        setFullscreenMode(false)
      }
    } catch (err) {
      console.warn('Fullscreen toggle failed:', err)
      setFullscreenMode(!fullscreenMode)
    }
  }

  // Sync fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setFullscreenMode(Boolean(document.fullscreenElement))
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [setFullscreenMode])

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 dark:border-zinc-800/80 bg-white/85 dark:bg-zinc-950/85 backdrop-blur-xl transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Left: Brand Logo & Live Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-linear-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
              <HugeiconsIcon icon={SparklesIcon} size={18} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-sm sm:text-base text-zinc-900 dark:text-white tracking-tight">
                  TierList<span className="text-indigo-600 dark:text-indigo-400">Maker</span>
                </span>
                <Badge variant="outline" className="gap-1 px-1.5 py-0 bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30 text-[9px] font-extrabold uppercase tracking-wider animate-pulse">
                  <HugeiconsIcon icon={RadioIcon} size={11} />
                  Live
                </Badge>
              </div>
            </div>
          </div>

          {/* Template Switcher Trigger Button */}
          <SimpleTooltip content="Choose or switch preset template" side="bottom">
            <button
              type="button"
              onClick={() => setTemplateOpen(true)}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-900/90 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-semibold border border-zinc-300 dark:border-zinc-800 transition-all shadow-2xs active:scale-95"
            >
              <span className="text-sm">{currentTemplate.icon}</span>
              <span className="max-w-[120px] truncate">{currentTemplate.name}</span>
              <span className="text-[10px] text-zinc-500 dark:text-zinc-400 bg-zinc-200 dark:bg-zinc-800 px-1.5 py-0.5 rounded font-mono">
                {TEMPLATES.length} Presets
              </span>
            </button>
          </SimpleTooltip>
        </div>

        {/* Right: Actions & Tools */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Undo / Redo Group */}
          <div className="flex items-center bg-zinc-100 dark:bg-zinc-900/90 border border-zinc-300 dark:border-zinc-800 rounded-xl p-0.5 shadow-2xs">
            <SimpleTooltip content="Undo previous action" shortcut="⌘Z" side="bottom">
              <button
                type="button"
                onClick={undo}
                disabled={!canUndo()}
                className="p-1.5 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 disabled:opacity-25 disabled:hover:bg-transparent active:scale-90 transition-all"
              >
                <HugeiconsIcon icon={Undo02Icon} size={15} />
              </button>
            </SimpleTooltip>
            <SimpleTooltip content="Redo action" shortcut="⌘Y" side="bottom">
              <button
                type="button"
                onClick={redo}
                disabled={!canRedo()}
                className="p-1.5 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 disabled:opacity-25 disabled:hover:bg-transparent active:scale-90 transition-all"
              >
                <HugeiconsIcon icon={Redo02Icon} size={15} />
              </button>
            </SimpleTooltip>
          </div>

          {/* Card Size Selector */}
          <div className="hidden sm:flex items-center bg-zinc-100 dark:bg-zinc-900/90 border border-zinc-300 dark:border-zinc-800 rounded-xl p-0.5 shadow-2xs">
            {sizeOptions.map((opt) => (
              <SimpleTooltip key={opt.size} content={opt.tooltip} side="bottom">
                <button
                  type="button"
                  onClick={() => setItemSize(opt.size)}
                  className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all active:scale-95 ${
                    itemSize === opt.size
                      ? 'bg-white dark:bg-zinc-200 text-zinc-900 dark:text-black shadow-xs'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                  }`}
                >
                  {opt.label}
                </button>
              </SimpleTooltip>
            ))}
          </div>

          {/* Theme Switcher */}
          <SimpleTooltip
            content={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            side="bottom"
          >
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-900/90 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-800 transition-all active:scale-90 shadow-2xs"
            >
              <HugeiconsIcon
                icon={theme === 'dark' ? Sun01Icon : Moon02Icon}
                size={16}
                className={theme === 'dark' ? 'text-amber-400' : 'text-indigo-600'}
              />
            </button>
          </SimpleTooltip>

          {/* Fullscreen Mode Button */}
          <SimpleTooltip
            content={fullscreenMode ? 'Exit Fullscreen (F)' : 'Full Screen View (F)'}
            shortcut="F"
            side="bottom"
          >
            <button
              type="button"
              onClick={toggleBrowserFullscreen}
              className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-90 shadow-2xs ${
                fullscreenMode
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-500/20'
                  : 'bg-zinc-100 dark:bg-zinc-900/90 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white border-zinc-300 dark:border-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-800'
              }`}
            >
              <HugeiconsIcon
                icon={fullscreenMode ? MinimizeScreenIcon : FullScreenIcon}
                size={15}
              />
            </button>
          </SimpleTooltip>

          {/* Preview / Presentation Mode Toggle */}
          <SimpleTooltip
            content={
              previewMode
                ? 'Exit Preview Mode (P)'
                : 'Preview / Broadcast Mode (P)'
            }
            shortcut="P"
            side="bottom"
          >
            <button
              type="button"
              onClick={() => setPreviewMode(!previewMode)}
              className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-90 shadow-2xs ${
                previewMode
                  ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-500/20'
                  : 'bg-zinc-100 dark:bg-zinc-900/90 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white border-zinc-300 dark:border-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-800'
              }`}
            >
              <HugeiconsIcon
                icon={previewMode ? EyeOffIcon : EyeIcon}
                size={15}
              />
              <span className="hidden lg:inline">
                {previewMode ? 'Previewing' : 'Preview'}
              </span>
            </button>
          </SimpleTooltip>

          {/* Export / Share Button */}
          <SimpleTooltip content="Export Tier List as PNG or JSON" shortcut="⌘E" side="bottom">
            <Button
              size="sm"
              onClick={() => setExportOpen(true)}
              className="gap-1.5 font-bold bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-md shadow-indigo-500/25 active:scale-95 transition-transform"
            >
              <HugeiconsIcon icon={Download01Icon} size={15} />
              <span>Export</span>
            </Button>
          </SimpleTooltip>
        </div>
      </div>
    </header>
  )
}
