import { useEffect } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Undo02Icon,
  Redo02Icon,
  Download01Icon,
  EyeIcon,
  EyeOffIcon,
  Sun01Icon,
  Moon02Icon,
  FullScreenIcon,
  MinimizeScreenIcon,
} from '@hugeicons/core-free-icons'
import { useTierListStore } from '../store/useTierListStore'
import { TEMPLATES } from '../lib/constants'
import type { ItemSize } from '../lib/types'
import { SimpleTooltip } from './ui/tooltip'
import { Button } from './ui/button'

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
    tiers,
    containers,
    setItemSize,
    setPreviewMode,
    setTemplateOpen,
    setExportOpen,
  } = useTierListStore()

  const currentTemplate =
    TEMPLATES.find((t) => t.id === selectedTemplateId) || TEMPLATES[0]

  const sizeOptions: { size: ItemSize; label: string; tooltip: string }[] = [
    { size: 'compact', label: 'S', tooltip: 'Compact Cards (64px)' },
    { size: 'normal', label: 'M', tooltip: 'Standard Cards (84px)' },
    { size: 'large', label: 'L', tooltip: 'Expanded Cards (104px)' },
  ]

  const toggleBrowserFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen()
        setFullscreenMode(true)
      } else {
        await document.exitFullscreen()
        setFullscreenMode(false)
        setPreviewMode(false)
      }
    } catch (err) {
      console.warn('Fullscreen toggle failed:', err)
      setFullscreenMode(!fullscreenMode)
    }
  }

  const togglePreview = async () => {
    if (previewMode) {
      setPreviewMode(false)
      setFullscreenMode(false)
      if (document.fullscreenElement) {
        try {
          await document.exitFullscreen()
        } catch (err) {
          console.warn('Exit fullscreen failed:', err)
        }
      }
    } else {
      setPreviewMode(true)
    }
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isDocFullscreen = Boolean(document.fullscreenElement)
      setFullscreenMode(isDocFullscreen)
      if (!isDocFullscreen) {
        setPreviewMode(false)
      }
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [setFullscreenMode, setPreviewMode])

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/90 backdrop-blur-xl transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-3">
        {/* Left: Brand Identity & Template Switcher */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg overflow-hidden border border-border bg-zinc-950 flex items-center justify-center shadow-xs">
              <img src="/logo.png" alt="Tier Studio Logo" className="w-full h-full object-cover" />
            </div>
            <div className="hidden xs:block">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-extrabold text-sm tracking-tight text-foreground" style={{ fontFamily: 'var(--font-display)' }}>
                  TIER STUDIO
                </span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                  LIVE
                </span>
              </div>
            </div>
          </div>

          <div className="h-4 w-px bg-border hidden sm:block" />

          {/* Template Switcher Trigger */}
          <SimpleTooltip content="Switch curated tier list preset" side="bottom">
            <button
              type="button"
              onClick={() => setTemplateOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-secondary hover:bg-accent text-secondary-foreground text-xs font-medium border border-border/60 transition-all active:scale-95"
            >
              <span className="text-sm leading-none">{currentTemplate.icon}</span>
              <span className="max-w-[100px] sm:max-w-[130px] truncate font-semibold">
                {currentTemplate.name}
              </span>
              <span className="hidden md:inline text-[10px] text-muted-foreground font-mono">
                ▼
              </span>
            </button>
          </SimpleTooltip>
        </div>

        {/* Center: Live Tier Distribution Mini-Bar */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/80 border border-border/60">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground mr-1">
            Spread
          </span>
          <div className="flex items-center gap-1">
            {tiers.map((t) => {
              const count = (containers[t.id] || []).length
              return (
                <SimpleTooltip
                  key={t.id}
                  content={`Tier ${t.title}: ${count} ${count === 1 ? 'item' : 'items'}`}
                  side="bottom"
                >
                  <div
                    className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-mono font-bold transition-transform hover:scale-105"
                    style={{
                      backgroundColor: `${t.color}20`,
                      color: t.color,
                      border: `1px solid ${t.color}40`,
                    }}
                  >
                    <span className="text-[10px]">{t.title.slice(0, 1)}</span>
                    <span className="text-[10px] opacity-80">{count}</span>
                  </div>
                </SimpleTooltip>
              )
            })}
          </div>
        </div>

        {/* Right: Tactile Studio Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Undo / Redo Segment */}
          <div className="flex items-center bg-secondary border border-border/70 rounded-lg p-0.5">
            <SimpleTooltip content="Undo (⌘Z)" side="bottom">
              <button
                type="button"
                onClick={undo}
                disabled={!canUndo()}
                className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-background disabled:opacity-20 disabled:hover:bg-transparent transition-all active:scale-95"
              >
                <HugeiconsIcon icon={Undo02Icon} size={15} />
              </button>
            </SimpleTooltip>
            <SimpleTooltip content="Redo (⌘Y / ⇧⌘Z)" side="bottom">
              <button
                type="button"
                onClick={redo}
                disabled={!canRedo()}
                className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-background disabled:opacity-20 disabled:hover:bg-transparent transition-all active:scale-95"
              >
                <HugeiconsIcon icon={Redo02Icon} size={15} />
              </button>
            </SimpleTooltip>
          </div>

          {/* Card Size S/M/L Toggle */}
          <div className="hidden sm:flex items-center bg-secondary border border-border/70 rounded-lg p-0.5">
            {sizeOptions.map((opt) => (
              <SimpleTooltip key={opt.size} content={opt.tooltip} side="bottom">
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

          {/* Theme Toggle */}
          <SimpleTooltip content={theme === 'dark' ? 'Light Mode' : 'Dark Mode'} side="bottom">
            <button
              type="button"
              onClick={toggleTheme}
              className="p-1.5 sm:p-2 rounded-lg bg-secondary hover:bg-accent text-muted-foreground hover:text-foreground border border-border/70 transition-all active:scale-90"
            >
              <HugeiconsIcon
                icon={theme === 'dark' ? Sun01Icon : Moon02Icon}
                size={15}
                className={theme === 'dark' ? 'text-amber-400' : 'text-slate-700'}
              />
            </button>
          </SimpleTooltip>

          {/* Fullscreen Button */}
          <SimpleTooltip content={fullscreenMode ? 'Exit Fullscreen (F)' : 'Fullscreen View (F)'} side="bottom">
            <button
              type="button"
              onClick={toggleBrowserFullscreen}
              className={`p-1.5 sm:p-2 rounded-lg border text-xs font-semibold transition-all active:scale-90 ${
                fullscreenMode
                  ? 'bg-foreground text-background border-foreground shadow-xs'
                  : 'bg-secondary hover:bg-accent text-muted-foreground hover:text-foreground border-border/70'
              }`}
            >
              <HugeiconsIcon
                icon={fullscreenMode ? MinimizeScreenIcon : FullScreenIcon}
                size={15}
              />
            </button>
          </SimpleTooltip>

          {/* Preview / Presentation Toggle */}
          <SimpleTooltip
            content={previewMode ? 'Exit Presentation Mode (P)' : 'Presentation Mode (P)'}
            side="bottom"
          >
            <button
              type="button"
              onClick={togglePreview}
              className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-90 ${
                previewMode
                  ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                  : 'bg-secondary hover:bg-accent text-muted-foreground hover:text-foreground border-border/70'
              }`}
            >
              <HugeiconsIcon icon={previewMode ? EyeOffIcon : EyeIcon} size={15} />
              <span className="hidden xl:inline">
                {previewMode ? 'Live Mode' : 'Present'}
              </span>
            </button>
          </SimpleTooltip>

          {/* Standout Export Button */}
          <Button
            size="sm"
            onClick={() => setExportOpen(true)}
            className="h-8 sm:h-9 px-3 gap-1.5 font-bold bg-foreground text-background hover:opacity-90 shadow-sm active:scale-95 transition-all text-xs"
          >
            <HugeiconsIcon icon={Download01Icon} size={14} />
            <span>Export</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
