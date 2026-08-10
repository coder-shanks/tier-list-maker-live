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
import { useTierListStore } from '../store/useTierListStore'
import DraggableItem from './DraggableItem'
import TierSettingsPopover from './TierSettingsPopover'
import { SimpleTooltip } from './ui/tooltip'

type TierRowProps = {
  tier: Tier
  itemIds: string[]
  isFirst: boolean
  isLast: boolean
}

export default function TierRow({
  tier,
  itemIds,
  isFirst,
  isLast,
}: TierRowProps) {
  const { ref } = useDroppable({
    id: tier.id,
  })

  const {
    items,
    deleteTier,
    moveTier,
    clearTier,
    previewMode,
  } = useTierListStore()

  // Find item objects for all IDs in this tier
  const tierItems = itemIds
    .map((id) => items.find((it) => it.id === id))
    .filter((it): it is NonNullable<typeof it> => Boolean(it))

  return (
    <div className="group/tier flex flex-col md:flex-row min-h-[90px] border-b border-zinc-200 dark:border-zinc-800/80 last:border-b-0 transition-colors bg-white/60 dark:bg-zinc-950/40 hover:bg-zinc-50/80 dark:hover:bg-zinc-900/30">
      {/* Left Column: Tier Label Header with Popover Trigger */}
      <div
        style={{ backgroundColor: tier.color }}
        className="w-full md:w-48 lg:w-56 shrink-0 min-h-[70px] md:min-h-[90px] p-3 flex items-center justify-between shadow-inner relative transition-colors"
      >
        <TierSettingsPopover
          tier={tier}
          isFirst={isFirst}
          isLast={isLast}
          itemCount={tierItems.length}
        >
          <button
            type="button"
            className="flex-1 min-w-0 pr-2 text-left group/title focus:outline-hidden"
            title="Click to edit tier name & color"
          >
            <div className="flex items-center gap-1.5">
              <h3
                style={{ color: tier.textColor || '#ffffff' }}
                className="font-extrabold text-base md:text-lg tracking-tight line-clamp-2 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]"
              >
                {tier.title}
              </h3>
              {!previewMode && (
                <span
                  className="opacity-0 group-hover/title:opacity-90 transition-opacity shrink-0"
                  style={{ color: tier.textColor || '#ffffff' }}
                >
                  <HugeiconsIcon icon={Edit02Icon} size={14} />
                </span>
              )}
            </div>

            {/* Item count badge */}
            <div className="mt-1 flex items-center gap-1.5">
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-black/30 backdrop-blur-xs text-white/90 border border-white/15 inline-flex items-center gap-1">
                <span>{tierItems.length}</span>
                <span className="opacity-75">{tierItems.length === 1 ? 'item' : 'items'}</span>
              </span>
            </div>
          </button>
        </TierSettingsPopover>

        {/* Tier Color / Settings Indicator */}
        {!previewMode && (
          <TierSettingsPopover
            tier={tier}
            isFirst={isFirst}
            isLast={isLast}
            itemCount={tierItems.length}
          >
            <button
              type="button"
              className="p-1.5 rounded-lg bg-black/20 hover:bg-black/40 text-white/90 hover:text-white transition-all backdrop-blur-xs flex items-center justify-center border border-white/10 hover:border-white/30"
              title="Tier Settings"
            >
              <HugeiconsIcon icon={ColorsIcon} size={16} />
            </button>
          </TierSettingsPopover>
        )}
      </div>

      {/* Center / Right: Droppable Tier Drop Zone */}
      <div
        ref={ref}
        className="flex-1 p-2.5 sm:p-3 min-h-[90px] flex flex-wrap gap-2.5 items-center content-center bg-zinc-50/50 dark:bg-zinc-900/60 transition-colors duration-200"
      >
        {tierItems.length === 0 ? (
          <div className="w-full h-full min-h-[60px] flex items-center justify-center border-2 border-dashed border-zinc-300 dark:border-zinc-800/80 rounded-xl p-2 text-zinc-400 dark:text-zinc-600 text-xs font-medium select-none pointer-events-none group-hover/tier:border-zinc-400 dark:group-hover/tier:border-zinc-700/60 transition-colors">
            Drop items here to rank in {tier.title}
          </div>
        ) : (
          tierItems.map((item) => (
            <DraggableItem
              key={item.id}
              item={item}
              currentContainerId={tier.id}
            />
          ))
        )}
      </div>

      {/* Right Controls Sidebar: Tier Row Actions (hidden in Preview Mode) */}
      {!previewMode && (
        <div className="hidden md:flex flex-col justify-center items-center gap-0.5 p-1.5 bg-zinc-100/90 dark:bg-zinc-950/80 border-l border-zinc-200 dark:border-zinc-800/80 shrink-0 w-11 opacity-60 group-hover/tier:opacity-100 transition-opacity">
          <SimpleTooltip content="Move Tier Up" side="left">
            <button
              type="button"
              disabled={isFirst}
              onClick={() => moveTier(tier.id, 'up')}
              className="p-1 rounded text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 disabled:opacity-20 disabled:hover:bg-transparent transition-colors"
            >
              <HugeiconsIcon icon={ArrowUp01Icon} size={16} />
            </button>
          </SimpleTooltip>

          <SimpleTooltip content="Move Tier Down" side="left">
            <button
              type="button"
              disabled={isLast}
              onClick={() => moveTier(tier.id, 'down')}
              className="p-1 rounded text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 disabled:opacity-20 disabled:hover:bg-transparent transition-colors"
            >
              <HugeiconsIcon icon={ArrowDown01Icon} size={16} />
            </button>
          </SimpleTooltip>

          <SimpleTooltip content="Clear all items in this tier" side="left">
            <button
              type="button"
              onClick={() => clearTier(tier.id)}
              disabled={tierItems.length === 0}
              className="p-1 rounded text-amber-500 dark:text-amber-400 hover:text-amber-600 dark:hover:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-950/40 disabled:opacity-20 disabled:hover:bg-transparent transition-colors"
            >
              <HugeiconsIcon icon={RotateLeft01Icon} size={14} />
            </button>
          </SimpleTooltip>

          <SimpleTooltip content="Delete this tier" side="left">
            <button
              type="button"
              onClick={() => deleteTier(tier.id)}
              className="p-1 rounded text-rose-500 dark:text-rose-400 hover:text-rose-600 dark:hover:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-950/40 transition-colors"
            >
              <HugeiconsIcon icon={Delete02Icon} size={14} />
            </button>
          </SimpleTooltip>
        </div>
      )}
    </div>
  )
}
