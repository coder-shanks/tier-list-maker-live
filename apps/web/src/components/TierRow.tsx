import { useDroppable } from '@dnd-kit/react'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  ArrowUp01Icon,
  ArrowDown01Icon,
  Delete02Icon,
  RotateLeft01Icon,
  Edit02Icon,
  ColorsIcon,
} from '@hugeicons/core-free-icons'
import type { Tier } from '../lib/types'
import { useUiStore } from '../store/useUiStore'
import { useTierDataStore } from '../store/useTierDataStore'
import { useBlindStore } from '../store/useBlindStore'
import DraggableItem from './DraggableItem'
import TierSettingsPopover from './TierSettingsPopover'
import { SimpleTooltip } from './ui/tooltip'

type TierRowProps = {
  tier: Tier
  itemIds: string[]
  isFirst: boolean
  isLast: boolean
}

export default function TierRow({ tier, itemIds, isFirst, isLast }: TierRowProps) {
  const isBlindActive = useBlindStore((s) => s.isActive)
  const blindMode = useBlindStore((s) => s.mode)
  const tierCap = useBlindStore((s) => s.tierCaps[tier.id])

  const { ref, isDropTarget } = useDroppable({
    id: tier.id,
    disabled:
      isBlindActive &&
      blindMode === 'hardcore' &&
      tierCap !== undefined &&
      itemIds.length >= tierCap,
  })

  const items = useTierDataStore((s) => s.items)
  const deleteTier = useTierDataStore((s) => s.deleteTier)
  const moveTier = useTierDataStore((s) => s.moveTier)
  const clearTier = useTierDataStore((s) => s.clearTier)

  const previewMode = useUiStore((s) => s.previewMode)

  // Find item objects for all IDs in this tier
  const tierItems = itemIds
    .map((id) => items.find((it) => it.id === id))
    .filter((it): it is NonNullable<typeof it> => Boolean(it))

  const isHardcoreFull =
    isBlindActive &&
    blindMode === 'hardcore' &&
    tierCap !== undefined &&
    tierItems.length >= tierCap

  return (
    <div
      className={`group/tier flex flex-col md:flex-row min-h-[84px] sm:min-h-[96px] border-b border-border last:border-b-0 transition-all duration-150 ${
        isDropTarget ? 'bg-accent/40' : 'bg-card/40 hover:bg-card/70'
      }`}
    >
      {/* Left Column: Iconic Grade Header with Popover Trigger */}
      <div
        style={{ backgroundColor: tier.color }}
        className="w-full md:w-44 lg:w-52 shrink-0 min-h-[64px] md:min-h-[96px] p-3 flex items-center justify-between shadow-inner relative transition-colors select-none"
      >
        <TierSettingsPopover
          tier={tier}
          isFirst={isFirst}
          isLast={isLast}
          itemCount={tierItems.length}
        >
          <button
            type="button"
            className="flex-1 min-w-0 pr-2 text-left group/title focus:outline-hidden cursor-pointer"
            title="Click to edit tier name & color"
          >
            <div className="flex items-center gap-1.5">
              <h3
                style={{ color: tier.textColor || '#ffffff' }}
                className="tier-grade-text font-black text-lg md:text-xl tracking-tight line-clamp-2"
              >
                {tier.title}
              </h3>
              {!previewMode && (
                <span
                  className="opacity-0 group-hover/title:opacity-90 transition-opacity shrink-0"
                  style={{ color: tier.textColor || '#ffffff' }}
                >
                  <HugeiconsIcon icon={Edit02Icon} size={13} />
                </span>
              )}
            </div>

            {/* Item count / capacity chip */}
            <div className="mt-0.5 flex items-center gap-1">
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-black/25 backdrop-blur-xs text-white/90 border border-white/10 inline-flex items-center gap-1">
                {isBlindActive && blindMode === 'hardcore' && tierCap !== undefined ? (
                  <span className={isHardcoreFull ? 'text-amber-300 font-bold' : ''}>
                    {tierItems.length}/{tierCap} {isHardcoreFull ? 'FULL' : 'slots'}
                  </span>
                ) : (
                  <>
                    <span>{tierItems.length}</span>
                    <span className="opacity-75">
                      {tierItems.length === 1 ? 'item' : 'items'}
                    </span>
                  </>
                )}
              </span>
            </div>
          </button>
        </TierSettingsPopover>

        {/* Tier Settings Color Icon Trigger */}
        {!previewMode && !isBlindActive && (
          <TierSettingsPopover
            tier={tier}
            isFirst={isFirst}
            isLast={isLast}
            itemCount={tierItems.length}
          >
            <button
              type="button"
              className="p-1.5 rounded-lg bg-black/20 hover:bg-black/40 text-white/90 hover:text-white transition-all backdrop-blur-xs flex items-center justify-center border border-white/10 hover:border-white/30 active:scale-90"
              title="Tier Color & Name Settings"
            >
              <HugeiconsIcon icon={ColorsIcon} size={15} />
            </button>
          </TierSettingsPopover>
        )}
      </div>

      {/* Center Droppable Tier Drop Zone */}
      <div
        ref={ref}
        style={{
          boxShadow: isDropTarget
            ? `inset 0 0 0 2px ${tier.color}, inset 0 0 24px ${tier.color}15`
            : undefined,
        }}
        className={`flex-1 p-2 sm:p-3 min-h-[84px] sm:min-h-[96px] flex flex-wrap gap-2 sm:gap-2.5 items-center content-center transition-all duration-150 ${
          isDropTarget ? 'bg-secondary/70 scale-[0.999]' : 'bg-background/40'
        }`}
      >
        {tierItems.length === 0 ? (
          <div
            className={`w-full h-full min-h-[56px] flex items-center justify-center border border-dashed rounded-lg p-2 text-xs font-mono font-medium select-none pointer-events-none transition-all duration-150 ${
              isHardcoreFull
                ? 'border-destructive/60 text-destructive bg-destructive/10 font-bold'
                : isDropTarget
                  ? 'border-rose-500 text-rose-500 bg-rose-500/10 font-bold'
                  : 'border-border/70 text-muted-foreground/60 group-hover/tier:text-muted-foreground'
            }`}
          >
            {isHardcoreFull
              ? `⚠️ Tier is FULL (max ${tierCap})`
              : isDropTarget
                ? `Drop into ${tier.title}`
                : `Drop items here`}
          </div>
        ) : (
          tierItems.map((item) => (
            <DraggableItem key={item.id} item={item} currentContainerId={tier.id} />
          ))
        )}
      </div>

      {/* Right Action Rail (Desktop only, hidden in preview & active blind challenge) */}
      {!previewMode && !isBlindActive && (
        <div className="hidden md:flex flex-col justify-center items-center gap-0.5 p-1 bg-secondary/50 border-l border-border shrink-0 w-10 opacity-40 group-hover/tier:opacity-100 transition-opacity">
          <SimpleTooltip content="Move Tier Up" side="left">
            <button
              type="button"
              disabled={isFirst}
              onClick={() => moveTier(tier.id, 'up')}
              className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-background disabled:opacity-20 disabled:hover:bg-transparent active:scale-90 transition-all"
            >
              <HugeiconsIcon icon={ArrowUp01Icon} size={15} />
            </button>
          </SimpleTooltip>

          <SimpleTooltip content="Move Tier Down" side="left">
            <button
              type="button"
              disabled={isLast}
              onClick={() => moveTier(tier.id, 'down')}
              className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-background disabled:opacity-20 disabled:hover:bg-transparent active:scale-90 transition-all"
            >
              <HugeiconsIcon icon={ArrowDown01Icon} size={15} />
            </button>
          </SimpleTooltip>

          <SimpleTooltip content="Return items to pool" side="left">
            <button
              type="button"
              onClick={() => clearTier(tier.id)}
              disabled={tierItems.length === 0}
              className="p-1 rounded text-amber-500 hover:text-amber-600 hover:bg-amber-500/10 disabled:opacity-20 disabled:hover:bg-transparent active:scale-90 transition-all"
            >
              <HugeiconsIcon icon={RotateLeft01Icon} size={13} />
            </button>
          </SimpleTooltip>

          <SimpleTooltip content="Delete this tier" side="left">
            <button
              type="button"
              onClick={() => deleteTier(tier.id)}
              className="p-1 rounded text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 active:scale-90 transition-all"
            >
              <HugeiconsIcon icon={Delete02Icon} size={13} />
            </button>
          </SimpleTooltip>
        </div>
      )}
    </div>
  )
}
