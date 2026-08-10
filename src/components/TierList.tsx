import { HugeiconsIcon } from '@hugeicons/react'
import {
  PlusSignIcon,
  Layers01Icon,
  Edit02Icon,
  UserIcon,
  FolderAddIcon,
  EyeOffIcon,
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
    setPreviewMode,
    setEditMetadataOpen,
  } = useTierListStore()

  // Calculate clear, self-explanatory statistics
  const totalItemsCount = items.length
  const unassignedCount = (containers['POOL'] || []).length
  const rankedCount = totalItemsCount - unassignedCount
  const percentRanked = totalItemsCount > 0 ? Math.round((rankedCount / totalItemsCount) * 100) : 0

  return (
    <div className="w-full max-w-7xl mx-auto space-y-4">
      {/* Edit Metadata Modal */}
      <EditMetadataModal />

      {/* Preview Mode Active Helper Banner */}
      {previewMode && (
        <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-700 dark:text-purple-300 text-xs font-semibold animate-in fade-in">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-500 animate-ping" />
            <span>
              Preview Mode Active (Editing controls and action buttons hidden for clean broadcast/viewing)
            </span>
          </div>
          <Button
            size="xs"
            onClick={() => setPreviewMode(false)}
            className="bg-purple-600 hover:bg-purple-500 text-white font-bold gap-1 text-[11px]"
          >
            <HugeiconsIcon icon={EyeOffIcon} size={13} />
            Exit Preview
          </Button>
        </div>
      )}

      {/* Tier Board Container (Captured during PNG Export) */}
      <div
        id="tier-list-canvas"
        className="bg-white dark:bg-zinc-950/90 border border-zinc-200 dark:border-zinc-800/90 rounded-2xl shadow-xl dark:shadow-2xl overflow-hidden backdrop-blur-xl transition-all duration-300"
      >
        {/* Board Header Section */}
        <div className="p-4 sm:p-6 bg-zinc-50/80 dark:bg-linear-to-b dark:from-zinc-900/90 dark:to-zinc-950/90 border-b border-zinc-200 dark:border-zinc-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1 space-y-1.5 min-w-0">
            {/* Board Title & Edit Trigger */}
            <div
              className="group/t flex items-center gap-2 cursor-pointer"
              onClick={() => setEditMetadataOpen(true)}
              title="Click to edit tier list info"
            >
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-zinc-900 dark:text-white tracking-tight bg-linear-to-r dark:from-white dark:via-zinc-200 dark:to-zinc-400 bg-clip-text">
                {title || 'Live Tier List'}
              </h1>
              {!previewMode && (
                <SimpleTooltip content="Edit Title & Info">
                  <span className="p-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-white opacity-0 group-hover/t:opacity-100 transition-opacity">
                    <HugeiconsIcon icon={Edit02Icon} size={15} />
                  </span>
                </SimpleTooltip>
              )}
            </div>

            {/* Board Subtitle & Author Tag */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-zinc-500 dark:text-zinc-400">
              <p
                className="cursor-pointer hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
                onClick={() => setEditMetadataOpen(true)}
                title="Click to edit subtitle"
              >
                {subtitle || 'Click to add a subtitle or criteria'}
              </p>

              {/* Creator Watermark Tag */}
              <div
                className="flex items-center gap-1.5 font-medium cursor-pointer"
                onClick={() => setEditMetadataOpen(true)}
                title="Click to edit creator name"
              >
                <span className="text-zinc-300 dark:text-zinc-700">•</span>
                <span className="text-indigo-600 dark:text-indigo-400">
                  <HugeiconsIcon icon={UserIcon} size={14} />
                </span>
                <span className="text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors">
                  by {author || 'Creator'}
                </span>
              </div>
            </div>
          </div>

          {/* Clear & Self-Explanatory Statistics */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Total Ranked Count */}
            <SimpleTooltip content={`${rankedCount} out of ${totalItemsCount} items placed in tiers`} side="bottom">
              <div tabIndex={0} role="status" className="px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 text-xs font-semibold flex items-center gap-2 shadow-2xs cursor-help focus:outline-hidden focus:ring-1 focus:ring-indigo-500/50">
                <span className="text-indigo-600 dark:text-indigo-400">
                  <HugeiconsIcon icon={Layers01Icon} size={14} />
                </span>
                <span className="text-zinc-500 dark:text-zinc-400">Ranked:</span>
                <span className="text-zinc-900 dark:text-white font-mono font-bold">
                  {rankedCount}/{totalItemsCount}
                </span>
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 font-bold bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border-0">
                  {percentRanked}%
                </Badge>
              </div>
            </SimpleTooltip>

            {/* Unassigned Remaining in Pool */}
            <SimpleTooltip content={`${unassignedCount} items still in the unassigned pool`} side="bottom">
              <div tabIndex={0} role="status" className="px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 text-xs font-semibold flex items-center gap-1.5 shadow-2xs cursor-help focus:outline-hidden focus:ring-1 focus:ring-amber-500/50">
                <span className="text-amber-500">
                  <HugeiconsIcon icon={FolderAddIcon} size={14} />
                </span>
                <span className="text-zinc-500 dark:text-zinc-400">In Pool:</span>
                <span className="text-zinc-800 dark:text-zinc-200 font-mono font-bold">
                  {unassignedCount}
                </span>
              </div>
            </SimpleTooltip>
          </div>
        </div>

        {/* Tier Rows Canvas */}
        <div className="divide-y divide-zinc-200 dark:divide-zinc-800/80">
          {tiers.length === 0 ? (
            <div className="p-12 text-center text-zinc-400 dark:text-zinc-500 space-y-3">
              <div className="mx-auto w-10 h-10 flex items-center justify-center text-zinc-400 dark:text-zinc-600 animate-pulse">
                <HugeiconsIcon icon={Layers01Icon} size={40} />
              </div>
              <p className="text-sm font-medium">No tiers created yet.</p>
              <Button
                size="sm"
                onClick={() => addTier('bottom')}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold"
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

      {/* Bottom Add Tier Button (Hidden in Preview Mode) */}
      {!previewMode && (
        <div className="flex items-center justify-between px-1">
          <SimpleTooltip content="Add a new custom tier row at the bottom" side="right">
            <Button
              variant="outline"
              size="sm"
              onClick={() => addTier('bottom')}
              className="gap-2 font-semibold bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-2xs group"
            >
              <span className="text-indigo-600 dark:text-indigo-400 group-hover:rotate-90 transition-transform duration-200">
                <HugeiconsIcon icon={PlusSignIcon} size={16} />
              </span>
              <span>Add New Tier</span>
            </Button>
          </SimpleTooltip>

          <p className="text-[11px] text-zinc-500 dark:text-zinc-500 hidden sm:block">
            Tip: Click any tier label to rename or change its color.
          </p>
        </div>
      )}
    </div>
  )
}
