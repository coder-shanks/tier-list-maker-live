import { useEffect, useState, useMemo } from 'react'
import { useDraggable } from '@dnd-kit/react'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  DicesIcon,
  SparklesIcon,
  Clock01Icon,
  StopIcon,
  Layers01Icon,
} from '@hugeicons/core-free-icons'
import { useBlindStore } from '../store/useBlindStore'
import { useTierDataStore } from '../store/useTierDataStore'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { SimpleTooltip } from './ui/tooltip'
import ConfirmModal from './ConfirmModal'

function SpotlightCard({ itemId }: { itemId: string }) {
  const items = useTierDataStore((s) => s.items)
  const item = items.find((it) => it.id === itemId)
  const [imgError, setImgError] = useState(false)

  const { ref, isDragging } = useDraggable({
    id: itemId,
  })

  if (!item) return null

  // Monogram background if no image
  const getMonogramBg = (name: string) => {
    const tones = [
      'bg-slate-900 text-slate-200 border-slate-700',
      'bg-zinc-900 text-zinc-200 border-zinc-700',
      'bg-stone-900 text-stone-200 border-stone-700',
      'bg-neutral-900 text-neutral-200 border-neutral-700',
    ]
    let hash = 0
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash)
    }
    return tones[Math.abs(hash) % tones.length]
  }

  return (
    <div
      ref={ref}
      className={`w-36 h-36 sm:w-44 sm:h-44 rounded-2xl overflow-hidden border-2 border-rose-500 shadow-2xl relative select-none cursor-grab active:cursor-grabbing transition-all duration-200 group ring-4 ring-rose-500/25 ${
        isDragging ? 'opacity-30 scale-95' : 'hover:scale-[1.03] active:scale-95'
      }`}
    >
      {item.imageUrl && !imgError ? (
        <img
          src={item.imageUrl}
          alt={item.title}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      ) : (
        <div
          className={`w-full h-full ${getMonogramBg(
            item.title,
          )} flex flex-col items-center justify-center p-3 text-center font-mono font-black border`}
        >
          <span className="text-2xl sm:text-3xl tracking-wider uppercase drop-shadow-sm">
            {item.title.slice(0, 3)}
          </span>
          {item.category && (
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1 max-w-[90%] truncate">
              {item.category}
            </span>
          )}
        </div>
      )}

      {/* Gradient Scrim */}
      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/35 to-transparent pointer-events-none" />

      {/* Category Tag */}
      {item.category && (
        <div className="absolute top-2 left-2 pointer-events-none">
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-black/80 backdrop-blur-xs text-zinc-200 border border-white/15 shadow-sm">
            {item.category}
          </span>
        </div>
      )}

      {/* Drag Indicator Pill */}
      <div className="absolute top-2 right-2 pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity">
        <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-rose-600 text-white shadow-xs">
          DRAG ME
        </span>
      </div>

      {/* Title Label */}
      <div className="absolute bottom-0 inset-x-0 p-2 sm:p-2.5 text-center pointer-events-none">
        <h4 className="font-extrabold text-white text-xs sm:text-sm leading-tight drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] line-clamp-2">
          {item.title}
        </h4>
        {item.subtitle && (
          <p className="text-[10px] text-zinc-300 truncate mt-0.5">
            {item.subtitle}
          </p>
        )}
      </div>
    </div>
  )
}

export default function BlindSpotlightArena() {
  const isActive = useBlindStore((s) => s.isActive)
  const mode = useBlindStore((s) => s.mode)
  const currentItemId = useBlindStore((s) => s.currentItemId)
  const queue = useBlindStore((s) => s.queue)
  const lockedItemIds = useBlindStore((s) => s.lockedItemIds)
  const tierCaps = useBlindStore((s) => s.tierCaps)
  const startedAt = useBlindStore((s) => s.startedAt)
  const totalItems = useBlindStore((s) => s.totalItems)
  const assignBlindCurrentItem = useBlindStore((s) => s.assignBlindCurrentItem)
  const stopBlindChallenge = useBlindStore((s) => s.stopBlindChallenge)

  const tiers = useTierDataStore((s) => s.tiers)
  const containers = useTierDataStore((s) => s.containers)

  // Live elapsed timer
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [isExitConfirmOpen, setIsExitConfirmOpen] = useState(false)

  useEffect(() => {
    if (!isActive || !startedAt) return

    const interval = setInterval(() => {
      const seconds = Math.floor((Date.now() - startedAt) / 1000)
      setElapsedSeconds(seconds)
    }, 1000)

    return () => clearInterval(interval)
  }, [isActive, startedAt])

  const formattedTime = useMemo(() => {
    const mins = Math.floor(elapsedSeconds / 60)
    const secs = elapsedSeconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }, [elapsedSeconds])

  const placedCount = lockedItemIds.length
  const percentComplete = totalItems > 0 ? Math.round((placedCount / totalItems) * 100) : 0
  const remainingInDeck = queue.length

  const handleGradeClick = (tierId: string) => {
    assignBlindCurrentItem(tierId)
  }

  const handleExitConfirm = () => {
    stopBlindChallenge(true)
  }

  if (!isActive) return null

  return (
    <div className="w-full max-w-7xl mx-auto mt-4 sm:mt-6">
      <div className="bg-card border-2 border-rose-500/50 rounded-2xl p-4 sm:p-6 shadow-2xl space-y-5 transition-colors relative overflow-hidden ring-1 ring-rose-500/20">
        {/* Glow Header Accent */}
        <div className="absolute top-0 inset-x-0 h-1 bg-linear-to-r from-rose-500 via-amber-500 to-rose-500" />

        {/* Top Arena Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20">
              <HugeiconsIcon icon={DicesIcon} size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3
                  className="font-black text-base sm:text-lg text-foreground tracking-tight"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Blind Ranking Arena
                </h3>
                <Badge
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 ${
                    mode === 'hardcore'
                      ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                      : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                  }`}
                >
                  {mode === 'hardcore' ? '🔥 HARDCORE LIMITS' : 'STANDARD MODE'}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Rank the spotlight card immediately. Once placed, it cannot be moved!
              </p>
            </div>
          </div>

          {/* Quick Metrics HUD */}
          <div className="flex items-center gap-2">
            {/* Timer */}
            <div className="px-3 py-1.5 rounded-lg bg-secondary border border-border flex items-center gap-1.5 text-xs font-mono font-bold text-foreground">
              <HugeiconsIcon icon={Clock01Icon} size={14} className="text-rose-500" />
              <span>{formattedTime}</span>
            </div>

            {/* Placed Progress */}
            <div className="px-3 py-1.5 rounded-lg bg-secondary border border-border flex items-center gap-1.5 text-xs font-mono font-bold text-foreground">
              <HugeiconsIcon icon={Layers01Icon} size={14} className="text-muted-foreground" />
              <span>
                {placedCount}/{totalItems}
              </span>
              <span className="text-[10px] text-rose-500 font-bold">({percentComplete}%)</span>
            </div>

            {/* Exit Challenge Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExitConfirmOpen(true)}
              className="text-xs font-bold gap-1.5 h-8 bg-secondary hover:bg-destructive/10 hover:text-destructive border-border active:scale-95"
            >
              <HugeiconsIcon icon={StopIcon} size={13} />
              <span>Exit Challenge</span>
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 rounded-full bg-secondary overflow-hidden border border-border">
          <div
            style={{ width: `${percentComplete}%` }}
            className="h-full bg-linear-to-r from-rose-500 to-amber-500 rounded-full transition-all duration-300 ease-out"
          />
        </div>

        {/* Central Arena Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Mystery Deck Draw Pile */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center p-4 rounded-xl bg-secondary/40 border border-border/80 text-center space-y-3">
            <div className="relative w-24 h-32 flex items-center justify-center select-none">
              {/* Stacked layered cards */}
              <div className="absolute inset-0 rounded-xl bg-zinc-800 border border-zinc-700 shadow-md rotate-6 scale-95 translate-y-1.5 opacity-60" />
              <div className="absolute inset-0 rounded-xl bg-zinc-850 border border-zinc-700 shadow-md -rotate-3 scale-98 translate-y-0.5 opacity-80" />
              <div className="absolute inset-0 rounded-xl bg-linear-to-br from-zinc-900 to-black border-2 border-rose-500/60 shadow-xl flex flex-col items-center justify-center p-2 text-center text-rose-500">
                <HugeiconsIcon icon={DicesIcon} size={28} />
                <span className="text-[9px] font-mono font-black tracking-widest text-zinc-400 mt-1 uppercase">
                  Mystery
                </span>
              </div>
            </div>

            <div className="space-y-0.5">
              <span className="text-xs font-black text-foreground font-mono">
                {remainingInDeck} {remainingInDeck === 1 ? 'card' : 'cards'} remaining
              </span>
              <p className="text-[11px] text-muted-foreground">
                Upcoming items remain strictly hidden
              </p>
            </div>
          </div>

          {/* Active Item Spotlight */}
          <div className="lg:col-span-8 flex flex-col items-center justify-center space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-500 font-mono">
              <HugeiconsIcon icon={SparklesIcon} size={14} />
              <span>Current Revealed Item to Place:</span>
            </div>

            {currentItemId ? (
              <SpotlightCard key={currentItemId} itemId={currentItemId} />
            ) : (
              <div className="w-36 h-36 rounded-2xl border border-dashed border-border flex items-center justify-center text-muted-foreground text-xs font-mono">
                No active card
              </div>
            )}

            {/* 1-Click Grade Action Bar */}
            <div className="w-full space-y-2 pt-2">
              <div className="text-center">
                <span className="text-[11px] text-muted-foreground font-mono">
                  Drag card to tier board or click 1-click grade below:
                </span>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 w-full max-w-xl mx-auto">
                {tiers.map((t) => {
                  const currentCount = (containers[t.id] || []).length
                  const cap = tierCaps[t.id]
                  const isFull = mode === 'hardcore' && cap !== undefined && currentCount >= cap

                  return (
                    <SimpleTooltip
                      key={t.id}
                      content={
                        isFull
                          ? `${t.title} is FULL (${currentCount}/${cap})`
                          : `Assign to ${t.title} ${mode === 'hardcore' && cap ? `(${currentCount}/${cap})` : ''}`
                      }
                      side="bottom"
                    >
                      <button
                        type="button"
                        onClick={() => handleGradeClick(t.id)}
                        disabled={isFull}
                        style={{
                          backgroundColor: isFull ? undefined : t.color,
                          color: isFull ? undefined : t.textColor || '#ffffff',
                        }}
                        className={`p-2.5 rounded-xl text-xs font-black shadow-md transition-all text-center flex flex-col items-center justify-center gap-0.5 truncate cursor-pointer ${
                          isFull
                            ? 'bg-secondary text-muted-foreground border border-border opacity-40 cursor-not-allowed'
                            : 'hover:scale-105 active:scale-95 hover:shadow-lg'
                        }`}
                      >
                        <span className="truncate max-w-full">{t.title}</span>
                        {mode === 'hardcore' && cap !== undefined && (
                          <span
                            className={`text-[9px] font-mono px-1 py-0 rounded ${
                              isFull ? 'bg-destructive/20 text-destructive font-bold' : 'bg-black/30 text-white/90'
                            }`}
                          >
                            {isFull ? 'FULL' : `${currentCount}/${cap}`}
                          </span>
                        )}
                      </button>
                    </SimpleTooltip>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Exit Challenge Confirmation Modal */}
      <ConfirmModal
        open={isExitConfirmOpen}
        onOpenChange={setIsExitConfirmOpen}
        title="Exit Blind Challenge?"
        description="Are you sure you want to exit the Blind Challenge? Your placed cards will remain locked on the board."
        confirmText="Exit Challenge"
        cancelText="Keep Playing"
        variant="warning"
        onConfirm={handleExitConfirm}
      />
    </div>
  )
}
