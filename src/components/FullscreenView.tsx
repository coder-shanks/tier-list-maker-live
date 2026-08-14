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
import { useUiStore, type PresentationTheme } from '../store/useUiStore'
import { useTierDataStore } from '../store/useTierDataStore'
import type { ItemSize } from '../lib/types'
import { SimpleTooltip } from './ui/tooltip'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'

export default function FullscreenView() {
  const fullscreenMode = useUiStore((s) => s.fullscreenMode)
  const setFullscreenMode = useUiStore((s) => s.setFullscreenMode)
  const previewMode = useUiStore((s) => s.previewMode)
  const setPreviewMode = useUiStore((s) => s.setPreviewMode)
  const theme = useUiStore((s) => s.theme)
  const toggleTheme = useUiStore((s) => s.toggleTheme)
  const presentationTheme = useUiStore((s) => s.presentationTheme)
  const setPresentationTheme = useUiStore((s) => s.setPresentationTheme)
  const itemSize = useUiStore((s) => s.itemSize)
  const setItemSize = useUiStore((s) => s.setItemSize)
  const setExportOpen = useUiStore((s) => s.setExportOpen)

  const items = useTierDataStore((s) => s.items)
  const containers = useTierDataStore((s) => s.containers)

  // Track browser native fullscreen state and sync with preview mode
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isDocFullscreen = Boolean(document.fullscreenElement)
      setFullscreenMode(isDocFullscreen)
      if (!isDocFullscreen) {
        // Exiting browser fullscreen automatically exits presentation mode too
        setPreviewMode(false)
      }
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [setFullscreenMode, setPreviewMode])

  const handleExitAll = async () => {
    setPreviewMode(false)
    setFullscreenMode(false)
    if (document.fullscreenElement) {
      try {
        await document.exitFullscreen()
      } catch (err) {
        console.warn('Exit fullscreen failed:', err)
      }
    }
  }

  const toggleBrowserFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen()
        setFullscreenMode(true)
      } else {
        await handleExitAll()
      }
    } catch (err) {
      console.warn('Fullscreen request failed:', err)
      setFullscreenMode(!fullscreenMode)
    }
  }

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#e11d48', '#ea580c', '#d97706', '#059669', '#0284c7', '#7c3aed'],
    })
  }

  const totalItemsCount = items.length
  const unassignedCount = (containers['POOL'] || []).length
  const rankedCount = totalItemsCount - unassignedCount
  const percentRanked = totalItemsCount > 0 ? Math.round((rankedCount / totalItemsCount) * 100) : 0

  const themeOptions: { id: PresentationTheme; label: string; bgClass: string; borderClass: string }[] = [
    { id: 'studio', label: 'Studio Obsidian', bgClass: 'bg-zinc-900', borderClass: 'border-zinc-700' },
    { id: 'neon', label: 'Cyber Dark', bgClass: 'bg-[#090a12]', borderClass: 'border-rose-500' },
    { id: 'slate', label: 'Architect Slate', bgClass: 'bg-slate-900', borderClass: 'border-slate-700' },
    { id: 'noir', label: 'Warm Charcoal', bgClass: 'bg-stone-900', borderClass: 'border-stone-700' },
    { id: 'clean', label: 'Studio Light', bgClass: 'bg-zinc-100', borderClass: 'border-zinc-300' },
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
      className="fixed bottom-6 inset-x-0 z-50 flex justify-center items-center pointer-events-none px-4 animate-in fade-in slide-in-from-bottom-4 duration-200"
    >
      <div className="pointer-events-auto flex flex-wrap items-center gap-2 p-1.5 sm:p-2 rounded-xl bg-card/95 border border-border text-foreground shadow-2xl backdrop-blur-xl transition-all">
        {/* Live Broadcast Progress Chip */}
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-secondary border border-border text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="hidden sm:inline text-muted-foreground">Ranked:</span>
          <span className="font-mono font-bold text-foreground">
            {rankedCount}/{totalItemsCount}
          </span>
          <Badge className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[10px] px-1.5 py-0">
            {percentRanked}%
          </Badge>
        </div>

        {/* Card Size Selector */}
        <div className="flex items-center bg-secondary border border-border rounded-lg p-0.5">
          {sizeOptions.map((opt) => (
            <SimpleTooltip key={opt.size} content={opt.tooltip} side="top">
              <button
                type="button"
                onClick={() => setItemSize(opt.size)}
                className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold transition-all ${
                  itemSize === opt.size
                    ? 'bg-background text-foreground shadow-2xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {opt.label}
              </button>
            </SimpleTooltip>
          ))}
        </div>

        {/* Presentation Backdrop Theme Popover */}
        <Popover>
          <PopoverTrigger
            render={
              <button
                type="button"
                className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg bg-secondary hover:bg-accent text-foreground border border-border transition-all flex items-center gap-1.5 text-xs font-semibold"
                title="Presentation Backdrop Theme"
              >
                <HugeiconsIcon icon={ColorsIcon} size={14} />
                <span className="hidden md:inline capitalize">{presentationTheme}</span>
              </button>
            }
          />
          <PopoverContent side="top" align="center" className="w-56 p-2.5 space-y-1.5 bg-card text-foreground border-border">
            <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-wider">
              Backdrop Style:
            </span>
            <div className="grid grid-cols-1 gap-1">
              {themeOptions.map((th) => (
                <button
                  key={th.id}
                  type="button"
                  onClick={() => setPresentationTheme(th.id)}
                  className={`flex items-center justify-between p-2 rounded-lg border text-xs font-semibold transition-all ${
                    presentationTheme === th.id
                      ? 'bg-secondary border-rose-500 text-foreground ring-1 ring-rose-500/40'
                      : 'bg-card hover:bg-secondary border-border text-muted-foreground'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${th.bgClass} border ${th.borderClass}`} />
                    <span>{th.label}</span>
                  </div>
                  {presentationTheme === th.id && (
                    <span className="text-[10px] font-mono text-rose-500 font-bold">Active</span>
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
            className="p-1.5 sm:p-2 rounded-lg bg-secondary hover:bg-accent text-rose-500 border border-border transition-all active:scale-95 shadow-2xs"
          >
            <HugeiconsIcon icon={SparklesIcon} size={15} />
          </button>
        </SimpleTooltip>

        {/* Dark/Light Toggle */}
        <SimpleTooltip content="Toggle Theme" side="top">
          <button
            type="button"
            onClick={toggleTheme}
            className="p-1.5 sm:p-2 rounded-lg bg-secondary hover:bg-accent text-muted-foreground hover:text-foreground border border-border transition-colors"
          >
            <HugeiconsIcon icon={theme === 'dark' ? Sun01Icon : Moon02Icon} size={14} />
          </button>
        </SimpleTooltip>

        {/* Export Quick PNG */}
        <Button
          size="xs"
          onClick={() => setExportOpen(true)}
          className="bg-foreground text-background hover:opacity-90 font-bold gap-1.5 h-8 px-2.5 rounded-lg shadow-sm"
        >
          <HugeiconsIcon icon={Download01Icon} size={13} />
          <span className="hidden sm:inline">Export</span>
        </Button>

        {/* Fullscreen Toggle */}
        <SimpleTooltip
          content={fullscreenMode ? 'Exit Fullscreen (Esc or F)' : 'Enter Fullscreen (F)'}
          side="top"
        >
          <button
            type="button"
            onClick={toggleBrowserFullscreen}
            className="p-1.5 sm:p-2 rounded-lg bg-secondary hover:bg-accent text-foreground border border-border transition-all active:scale-95"
          >
            <HugeiconsIcon icon={fullscreenMode ? MinimizeScreenIcon : FullScreenIcon} size={14} />
          </button>
        </SimpleTooltip>

        {/* 1-Click Unified Exit Button for both Preview & Fullscreen */}
        {(previewMode || fullscreenMode) && (
          <Button
            size="xs"
            variant="destructive"
            onClick={handleExitAll}
            className="font-bold gap-1.5 h-8 px-2.5 rounded-lg active:scale-95"
          >
            <HugeiconsIcon icon={EyeOffIcon} size={13} />
            <span>Exit</span>
          </Button>
        )}
      </div>
    </aside>
  )
}
