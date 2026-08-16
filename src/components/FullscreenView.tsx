import confetti from 'canvas-confetti'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  SparklesIcon,
  Download01Icon,
  EyeOffIcon,
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
  const previewMode = useUiStore((s) => s.previewMode)
  const setPreviewMode = useUiStore((s) => s.setPreviewMode)
  const presentationTheme = useUiStore((s) => s.presentationTheme)
  const setPresentationTheme = useUiStore((s) => s.setPresentationTheme)
  const itemSize = useUiStore((s) => s.itemSize)
  const setItemSize = useUiStore((s) => s.setItemSize)
  const setExportOpen = useUiStore((s) => s.setExportOpen)

  const items = useTierDataStore((s) => s.items)
  const containers = useTierDataStore((s) => s.containers)

  const handleExit = () => {
    setPreviewMode(false)
  }

  const triggerConfetti = () => {
    confetti({
      particleCount: 90,
      spread: 75,
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
    { size: 'compact', label: 'S', tooltip: 'Small Cards (64px)' },
    { size: 'normal', label: 'M', tooltip: 'Medium Cards (84px)' },
    { size: 'large', label: 'L', tooltip: 'Large Cards (104px)' },
  ]

  // Only render floating presentation toolbar when in presentation mode
  if (!previewMode) return null

  return (
    <aside
      aria-label="Presentation mode toolbar"
      className="fixed bottom-6 inset-x-0 z-50 flex justify-center items-center pointer-events-none px-4 animate-in fade-in slide-in-from-bottom-4 duration-200"
    >
      <div className="pointer-events-auto flex flex-wrap items-center gap-2 p-1.5 sm:p-2 rounded-2xl bg-card/95 border border-border/80 text-foreground shadow-2xl backdrop-blur-xl ring-1 ring-border/50 transition-all">
        {/* Live Broadcast Progress Chip */}
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-secondary/80 border border-border/70 text-xs font-semibold">
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
        <div className="flex items-center bg-secondary/80 border border-border/70 rounded-xl p-0.5">
          {sizeOptions.map((opt) => (
            <SimpleTooltip key={opt.size} content={opt.tooltip} side="top">
              <button
                type="button"
                onClick={() => setItemSize(opt.size)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  itemSize === opt.size
                    ? 'bg-background text-foreground shadow-xs'
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
                className="p-1.5 sm:px-2.5 sm:py-1 rounded-xl bg-secondary/80 hover:bg-accent text-foreground border border-border/70 transition-all flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
                title="Presentation Backdrop Theme"
              >
                <HugeiconsIcon icon={ColorsIcon} size={14} />
                <span className="hidden md:inline capitalize">{presentationTheme}</span>
              </button>
            }
          />
          <PopoverContent side="top" align="center" className="w-56 p-2.5 space-y-1.5 bg-card text-foreground border-border rounded-xl shadow-xl">
            <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-wider">
              Backdrop Style:
            </span>
            <div className="grid grid-cols-1 gap-1">
              {themeOptions.map((th) => (
                <button
                  key={th.id}
                  type="button"
                  onClick={() => setPresentationTheme(th.id)}
                  className={`flex items-center justify-between p-2 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
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
            className="p-1.5 sm:p-2 rounded-xl bg-secondary/80 hover:bg-accent text-rose-500 border border-border/70 transition-all active:scale-95 shadow-xs cursor-pointer"
          >
            <HugeiconsIcon icon={SparklesIcon} size={15} />
          </button>
        </SimpleTooltip>

        {/* Export Quick PNG */}
        <Button
          size="xs"
          onClick={() => setExportOpen(true)}
          className="bg-foreground text-background hover:opacity-90 font-bold gap-1.5 h-8 px-3 rounded-xl shadow-sm cursor-pointer"
        >
          <HugeiconsIcon icon={Download01Icon} size={13} />
          <span className="hidden sm:inline">Export</span>
        </Button>

        {/* Exit Presentation Mode */}
        <Button
          size="xs"
          variant="destructive"
          onClick={handleExit}
          className="font-bold gap-1.5 h-8 px-3 rounded-xl active:scale-95 cursor-pointer"
        >
          <HugeiconsIcon icon={EyeOffIcon} size={13} />
          <span>Exit (Esc)</span>
        </Button>
      </div>
    </aside>
  )
}

