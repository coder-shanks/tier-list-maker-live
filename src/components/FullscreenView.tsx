import { useEffect } from 'react'
import confetti from 'canvas-confetti'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  SparklesIcon,
  Download01Icon,
  EyeOffIcon,
  Sun01Icon,
  Moon02Icon,
  FullScreenIcon,
  MinimizeScreenIcon,
  ColorsIcon,
} from '@hugeicons/core-free-icons'
import { useTierListStore, type PresentationTheme } from '../store/useTierListStore'
import type { ItemSize } from '../lib/types'
import { SimpleTooltip } from './ui/tooltip'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'

export default function FullscreenView() {
  const {
    fullscreenMode,
    setFullscreenMode,
    previewMode,
    setPreviewMode,
    theme,
    toggleTheme,
    presentationTheme,
    setPresentationTheme,
    itemSize,
    setItemSize,
    setExportOpen,
    items,
    containers,
  } = useTierListStore()

  // Track browser native fullscreen state
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isDocFullscreen = Boolean(document.fullscreenElement)
      if (fullscreenMode !== isDocFullscreen) {
        setFullscreenMode(isDocFullscreen)
      }
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [fullscreenMode, setFullscreenMode])

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
      console.warn('Fullscreen request failed:', err)
      // Fallback: toggle internal fullscreen layout state
      setFullscreenMode(!fullscreenMode)
    }
  }

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.7 },
      colors: ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'],
    })
  }

  const totalItemsCount = items.length
  const unassignedCount = (containers['POOL'] || []).length
  const rankedCount = totalItemsCount - unassignedCount
  const percentRanked = totalItemsCount > 0 ? Math.round((rankedCount / totalItemsCount) * 100) : 0

  const themeOptions: { id: PresentationTheme; label: string; bgClass: string; borderClass: string }[] = [
    { id: 'studio', label: 'Studio Dark', bgClass: 'bg-zinc-900', borderClass: 'border-zinc-700' },
    { id: 'neon', label: 'Cyber Neon', bgClass: 'bg-indigo-950', borderClass: 'border-indigo-500' },
    { id: 'slate', label: 'Slate Pro', bgClass: 'bg-slate-900', borderClass: 'border-slate-700' },
    { id: 'noir', label: 'Warm Noir', bgClass: 'bg-stone-900', borderClass: 'border-stone-700' },
    { id: 'clean', label: 'Clean Mode', bgClass: 'bg-zinc-950', borderClass: 'border-zinc-800' },
  ]

  const sizeOptions: { size: ItemSize; label: string; tooltip: string }[] = [
    { size: 'compact', label: 'S', tooltip: 'Small Cards' },
    { size: 'normal', label: 'M', tooltip: 'Medium Cards' },
    { size: 'large', label: 'L', tooltip: 'Large Cards' },
  ]

  // Only render floating broadcast bar when in preview or fullscreen mode
  if (!previewMode && !fullscreenMode) return null

  return (
    <aside
      aria-label="Presentation mode toolbar"
      className="fixed bottom-6 inset-x-0 z-50 flex justify-center items-center pointer-events-none px-4 animate-in fade-in slide-in-from-bottom-4 duration-300"
    >
      <div className="pointer-events-auto flex flex-wrap items-center gap-2 p-2 rounded-2xl bg-zinc-950/90 dark:bg-black/90 border border-white/20 text-white shadow-2xl backdrop-blur-2xl transition-all">
        {/* Live Broadcast Badge & Progress */}
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-white/10 border border-white/10 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="hidden sm:inline text-zinc-300">Ranked:</span>
          <span className="font-mono font-bold text-white">
            {rankedCount}/{totalItemsCount}
          </span>
          <Badge className="bg-emerald-500/20 text-emerald-300 border-0 text-[10px] px-1.5 py-0">
            {percentRanked}%
          </Badge>
        </div>

        {/* Card Size Selector */}
        <div className="flex items-center bg-white/10 border border-white/10 rounded-xl p-0.5">
          {sizeOptions.map((opt) => (
            <SimpleTooltip key={opt.size} content={opt.tooltip} side="top">
              <button
                type="button"
                onClick={() => setItemSize(opt.size)}
                className={`px-2 py-1 rounded-lg text-xs font-bold transition-all ${
                  itemSize === opt.size
                    ? 'bg-white text-black shadow-xs'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {opt.label}
              </button>
            </SimpleTooltip>
          ))}
        </div>

        {/* Presentation Background Theme Popover */}
        <Popover>
          <PopoverTrigger
            render={
              <button
                type="button"
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-zinc-200 hover:text-white border border-white/10 transition-all flex items-center gap-1.5 text-xs font-semibold"
                title="Presentation Backdrop Theme"
              >
                <HugeiconsIcon icon={ColorsIcon} size={15} />
                <span className="hidden md:inline capitalize">{presentationTheme}</span>
              </button>
            }
          />
          <PopoverContent side="top" align="center" className="w-56 p-3 space-y-2 bg-zinc-950 text-white border-zinc-800">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
              Backdrop Theme:
            </span>
            <div className="grid grid-cols-1 gap-1.5">
              {themeOptions.map((th) => (
                <button
                  key={th.id}
                  type="button"
                  onClick={() => setPresentationTheme(th.id)}
                  className={`flex items-center justify-between p-2 rounded-xl border text-xs font-semibold transition-all ${
                    presentationTheme === th.id
                      ? 'bg-indigo-600/30 border-indigo-500 text-white ring-1 ring-indigo-500'
                      : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-zinc-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${th.bgClass} border ${th.borderClass}`} />
                    <span>{th.label}</span>
                  </div>
                  {presentationTheme === th.id && (
                    <span className="text-[10px] text-indigo-400 font-bold">Active</span>
                  )}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Confetti Celebration Button */}
        <SimpleTooltip content="Celebrate / Blast Confetti" side="top">
          <button
            type="button"
            onClick={triggerConfetti}
            className="p-2 rounded-xl bg-linear-to-r from-pink-500/20 to-purple-500/20 hover:from-pink-500/30 hover:to-purple-500/30 text-pink-300 border border-pink-500/30 transition-all active:scale-95 shadow-2xs"
          >
            <HugeiconsIcon icon={SparklesIcon} size={16} />
          </button>
        </SimpleTooltip>

        {/* Dark/Light Toggle */}
        <SimpleTooltip content="Toggle Theme" side="top">
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white border border-white/10 transition-colors"
          >
            <HugeiconsIcon icon={theme === 'dark' ? Sun01Icon : Moon02Icon} size={15} />
          </button>
        </SimpleTooltip>

        {/* Export Quick PNG */}
        <SimpleTooltip content="Export Tier List Image" shortcut="⌘E" side="top">
          <Button
            size="xs"
            onClick={() => setExportOpen(true)}
            className="bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold gap-1.5 h-8 px-3 rounded-xl shadow-md shadow-indigo-500/30"
          >
            <HugeiconsIcon icon={Download01Icon} size={14} />
            <span className="hidden sm:inline">Export</span>
          </Button>
        </SimpleTooltip>

        {/* Fullscreen Toggle */}
        <SimpleTooltip
          content={fullscreenMode ? 'Exit Browser Fullscreen (Esc or F)' : 'Enter Fullscreen Mode (F)'}
          side="top"
        >
          <button
            type="button"
            onClick={toggleBrowserFullscreen}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-zinc-200 hover:text-white border border-white/10 transition-all active:scale-95"
          >
            <HugeiconsIcon icon={fullscreenMode ? MinimizeScreenIcon : FullScreenIcon} size={15} />
          </button>
        </SimpleTooltip>

        {/* Exit Preview Mode Button */}
        {previewMode && (
          <Button
            size="xs"
            variant="destructive"
            onClick={() => setPreviewMode(false)}
            className="font-bold gap-1.5 h-8 px-3 rounded-xl"
          >
            <HugeiconsIcon icon={EyeOffIcon} size={14} />
            <span>Exit Preview</span>
          </Button>
        )}
      </div>
    </aside>
  )
}
