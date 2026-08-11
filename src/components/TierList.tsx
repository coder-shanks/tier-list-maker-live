import confetti from 'canvas-confetti'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  PlusSignIcon,
  Layers01Icon,
  Edit02Icon,
  UserIcon,
  SparklesIcon,
  FolderAddIcon,
} from '@hugeicons/core-free-icons'
import { useTierListStore } from '../store/useTierListStore'
import TierRow from './TierRow'
import { SimpleTooltip } from './ui/tooltip'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import EditMetadataModal from './EditMetadataModal'

export default function TierList() {
  const {
    title,
    subtitle,
    author,
    tiers,
    items,
    containers,
    addTier,
    previewMode,
    presentationTheme,
    setEditMetadataOpen,
  } = useTierListStore()

  // Statistics calculation
  const totalItemsCount = items.length
  const unassignedCount = (containers['POOL'] || []).length
  const rankedCount = totalItemsCount - unassignedCount
  const percentRanked = totalItemsCount > 0 ? Math.round((rankedCount / totalItemsCount) * 100) : 0
  const isAllRanked = totalItemsCount > 0 && unassignedCount === 0

  const triggerCelebrate = () => {
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#e11d48', '#ea580c', '#d97706', '#059669', '#0284c7', '#7c3aed'],
    })
  }

  // Theme canvas background classes
  const themeCanvasClasses = {
    studio: 'bg-card border-border/80 shadow-xl',
    neon: 'bg-[#090a12] border-rose-500/30 shadow-2xl ring-1 ring-rose-500/20',
    slate: 'bg-slate-950 border-slate-800 shadow-2xl',
    noir: 'bg-stone-950 border-stone-800 shadow-2xl',
    clean: 'bg-card border-border shadow-md',
  }[presentationTheme]

  return (
    <div className="w-full max-w-7xl mx-auto space-y-3">
      {/* Edit Metadata Modal */}
      <EditMetadataModal />

      {/* Completion Milestone Banner */}
      {isAllRanked && !previewMode && (
        <div className="flex items-center justify-between p-3 px-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-emerald-500/20 text-emerald-500">
              <HugeiconsIcon icon={SparklesIcon} size={15} />
            </span>
            <span>
              All <strong className="font-mono">{totalItemsCount}</strong> items placed! Tier list is complete.
            </span>
          </div>
          <Button
            size="xs"
            onClick={triggerCelebrate}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold gap-1 text-[11px] rounded-lg shadow-xs active:scale-95"
          >
            <HugeiconsIcon icon={SparklesIcon} size={12} />
            Celebrate
          </Button>
        </div>
      )}

      {/* Main Tier Board Canvas (Exported as PNG Graphic) */}
      <div
        id="tier-list-canvas"
        className={`rounded-xl border overflow-hidden transition-all duration-300 ${themeCanvasClasses}`}
      >
        {/* Board Header Bar */}
        <div className="p-4 sm:p-5 bg-card border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex-1 space-y-1 min-w-0">
            {/* Title */}
            <div
              className="group/t inline-flex items-center gap-2 cursor-pointer"
              onClick={() => setEditMetadataOpen(true)}
              title="Click to edit tier list title"
            >
              <h1
                className="text-xl sm:text-2xl font-black text-foreground tracking-tight"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {title || 'Live Tier List'}
              </h1>
              {!previewMode && (
                <SimpleTooltip content="Edit Board Title & Info">
                  <span className="p-1 rounded bg-secondary text-muted-foreground group-hover/t:text-foreground opacity-0 group-hover/t:opacity-100 transition-opacity">
                    <HugeiconsIcon icon={Edit02Icon} size={14} />
                  </span>
                </SimpleTooltip>
              )}
            </div>

            {/* Subtitle & Author Watermark */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
              <p
                className="cursor-pointer hover:text-foreground transition-colors line-clamp-1"
                onClick={() => setEditMetadataOpen(true)}
                title="Click to edit subtitle"
              >
                {subtitle || 'Click to add ranking criteria or notes'}
              </p>

              <div
                className="flex items-center gap-1.5 font-medium cursor-pointer"
                onClick={() => setEditMetadataOpen(true)}
                title="Click to edit creator name"
              >
                <span className="text-border">•</span>
                <span className="text-muted-foreground">
                  <HugeiconsIcon icon={UserIcon} size={13} />
                </span>
                <span className="text-foreground/80 hover:text-foreground transition-colors font-semibold">
                  by {author || 'Creator'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Ranked Counter */}
            <SimpleTooltip content={`${rankedCount} of ${totalItemsCount} items ranked`} side="bottom">
              <div tabIndex={0} role="status" className="px-2.5 py-1.5 rounded-lg bg-secondary border border-border/80 text-xs font-semibold flex items-center gap-2">
                <span className="text-muted-foreground">
                  <HugeiconsIcon icon={Layers01Icon} size={14} />
                </span>
                <span className="text-muted-foreground">Ranked:</span>
                <span className="font-mono font-bold text-foreground">
                  {rankedCount}/{totalItemsCount}
                </span>
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 font-mono font-bold bg-foreground/10 text-foreground border-0">
                  {percentRanked}%
                </Badge>
              </div>
            </SimpleTooltip>

            {/* Pool Counter */}
            <SimpleTooltip content={`${unassignedCount} unranked items remaining`} side="bottom">
              <div tabIndex={0} role="status" className="px-2.5 py-1.5 rounded-lg bg-secondary border border-border/80 text-xs font-semibold flex items-center gap-1.5">
                <span className="text-amber-500">
                  <HugeiconsIcon icon={FolderAddIcon} size={14} />
                </span>
                <span className="text-muted-foreground">Vault:</span>
                <span className="font-mono font-bold text-foreground">
                  {unassignedCount}
                </span>
              </div>
            </SimpleTooltip>
          </div>
        </div>

        {/* Tier Rows Canvas */}
        <div className="divide-y divide-border">
          {tiers.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground space-y-3">
              <div className="mx-auto w-10 h-10 flex items-center justify-center text-muted-foreground opacity-50">
                <HugeiconsIcon icon={Layers01Icon} size={36} />
              </div>
              <p className="text-sm font-medium">No tiers created yet.</p>
              <Button
                size="sm"
                onClick={() => addTier('bottom')}
                className="font-semibold active:scale-95"
              >
                + Add First Tier
              </Button>
            </div>
          ) : (
            tiers.map((tier, index) => (
              <TierRow
                key={tier.id}
                tier={tier}
                itemIds={containers[tier.id] || []}
                isFirst={index === 0}
                isLast={index === tiers.length - 1}
              />
            ))
          )}
        </div>
      </div>

      {/* Bottom Actions Bar */}
      {!previewMode && (
        <div className="flex items-center justify-between px-1 pt-1">
          <SimpleTooltip content="Add a new custom tier row at bottom" side="right">
            <Button
              variant="outline"
              size="sm"
              onClick={() => addTier('bottom')}
              className="gap-1.5 font-bold bg-card border-border shadow-2xs group active:scale-95 text-xs h-8"
            >
              <span className="text-muted-foreground group-hover:text-foreground group-hover:rotate-90 transition-transform duration-200">
                <HugeiconsIcon icon={PlusSignIcon} size={15} />
              </span>
              <span>Add New Tier</span>
            </Button>
          </SimpleTooltip>

          <p className="text-[11px] text-muted-foreground font-mono hidden sm:block">
            Tip: Drag items or click 3-dots to quick-assign • Click tier headers to customize
          </p>
        </div>
      )}
    </div>
  )
}
