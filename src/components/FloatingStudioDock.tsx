import { useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  PlusSignIcon,
  DicesIcon,
  Sun01Icon,
  Moon02Icon,
  ShuffleIcon,
  RotateLeft01Icon,
  MoreVerticalIcon,
  SparklesIcon,
} from '@hugeicons/core-free-icons'
import { useUiStore } from '../store/useUiStore'
import { useTierDataStore } from '../store/useTierDataStore'
import { useBlindStore } from '../store/useBlindStore'
import type { ItemSize } from '../lib/types'
import { SimpleTooltip } from './ui/tooltip'
import { Button } from './ui/button'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import ConfirmModal from './ConfirmModal'

export default function FloatingStudioDock() {
  const previewMode = useUiStore((s) => s.previewMode)
  const theme = useUiStore((s) => s.theme)
  const toggleTheme = useUiStore((s) => s.toggleTheme)
  const itemSize = useUiStore((s) => s.itemSize)
  const setItemSize = useUiStore((s) => s.setItemSize)
  const setAddItemOpen = useUiStore((s) => s.setAddItemOpen)
  const setBlindSetupOpen = useUiStore((s) => s.setBlindSetupOpen)
  const setRandomPickerOpen = useUiStore((s) => s.setRandomPickerOpen)
  const isRandomPickerOpen = useUiStore((s) => s.isRandomPickerOpen)

  const isBlindActive = useBlindStore((s) => s.isActive)
  const items = useTierDataStore((s) => s.items)
  const containers = useTierDataStore((s) => s.containers)
  const shufflePool = useTierDataStore((s) => s.shufflePool)
  const resetAllToPool = useTierDataStore((s) => s.resetAllToPool)

  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false)
  const [isToolsPopoverOpen, setIsToolsPopoverOpen] = useState(false)

  const poolItemIds = containers['POOL'] || []
  const rankedCount = items.length - poolItemIds.length

  const sizeOptions: { size: ItemSize; label: string; tooltip: string }[] = [
    { size: 'compact', label: 'S', tooltip: 'Small Cards (64px)' },
    { size: 'normal', label: 'M', tooltip: 'Medium Cards (84px)' },
    { size: 'large', label: 'L', tooltip: 'Large Cards (104px)' },
  ]

  // Hide floating dock during presentation preview or active blind challenge arena
  if (previewMode || isBlindActive) {
    return null
  }

  return (
    <>
      <aside
        aria-label="Studio quick actions dock"
        className="fixed bottom-6 inset-x-0 z-30 flex justify-center items-center pointer-events-none px-4 animate-in fade-in slide-in-from-bottom-4 duration-300"
      >
        <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 rounded-2xl bg-card/90 border border-border/80 text-foreground shadow-2xl backdrop-blur-xl ring-1 ring-border/40 transition-all hover:shadow-rose-500/5">
          {/* Card Size Selector Segment */}
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

          <div className="h-5 w-px bg-border/80" />

          {/* Primary Action: + Add Card */}
          <SimpleTooltip content="Add item from Wikipedia, URL, or custom text (N)" shortcut="N" side="top">
            <Button
              size="sm"
              onClick={() => setAddItemOpen(true)}
              className="h-8 sm:h-8.5 px-3 rounded-xl font-bold bg-foreground text-background hover:opacity-90 shadow-sm active:scale-95 transition-all text-xs gap-1.5 cursor-pointer"
            >
              <HugeiconsIcon icon={PlusSignIcon} size={15} />
              <span>Add Card</span>
            </Button>
          </SimpleTooltip>

          {/* Play & Challenge Modes Group */}
          <div className="flex items-center gap-1 bg-secondary/80 border border-border/70 rounded-xl p-0.5">
            {/* Blind Ranking Challenge */}
            <SimpleTooltip
              content={
                isRandomPickerOpen
                  ? 'Roulette is currently open'
                  : 'Blind Ranking Challenge Mode (B)'
              }
              shortcut="B"
              side="top"
            >
              <button
                type="button"
                disabled={isRandomPickerOpen || poolItemIds.length === 0}
                onClick={() => setBlindSetupOpen(true)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold text-rose-500 dark:text-rose-400 hover:bg-rose-500/10 active:scale-95 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <HugeiconsIcon icon={DicesIcon} size={14} />
                <span className="hidden sm:inline">Blind Rank</span>
              </button>
            </SimpleTooltip>

            {/* Streamer Roulette Picker */}
            <SimpleTooltip
              content="Spin random card for live stream / audience (R)"
              shortcut="R"
              side="top"
            >
              <button
                type="button"
                disabled={poolItemIds.length === 0}
                onClick={() => setRandomPickerOpen(true)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500/10 active:scale-95 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <HugeiconsIcon icon={SparklesIcon} size={13} />
                <span className="hidden md:inline">Roulette</span>
              </button>
            </SimpleTooltip>
          </div>

          <div className="h-5 w-px bg-border/80" />

          {/* Quick Tools Popover (Shuffle Vault, Reset Board) */}
          <Popover open={isToolsPopoverOpen} onOpenChange={setIsToolsPopoverOpen}>
            <SimpleTooltip content="Board & Vault Utilities" side="top">
              <PopoverTrigger
                render={
                  <button
                    type="button"
                    className="p-1.5 sm:p-2 rounded-xl bg-secondary/80 hover:bg-accent text-muted-foreground hover:text-foreground border border-border/70 transition-all active:scale-95 cursor-pointer"
                  >
                    <HugeiconsIcon icon={MoreVerticalIcon} size={15} />
                  </button>
                }
              />
            </SimpleTooltip>
            <PopoverContent
              side="top"
              align="center"
              sideOffset={8}
              className="w-52 p-2 space-y-1 bg-card text-foreground border-border rounded-xl shadow-xl"
            >
              <div className="px-2 py-1 text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-wider">
                Quick Actions
              </div>

              {/* Shuffle Vault */}
              <button
                type="button"
                onClick={() => {
                  shufflePool()
                  setIsToolsPopoverOpen(false)
                }}
                disabled={poolItemIds.length <= 1}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium rounded-lg hover:bg-secondary transition-colors text-left disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <HugeiconsIcon icon={ShuffleIcon} size={14} className="text-muted-foreground" />
                <span>Shuffle Vault Items</span>
              </button>

              {/* Reset Board */}
              <button
                type="button"
                onClick={() => {
                  setIsToolsPopoverOpen(false)
                  setIsResetConfirmOpen(true)
                }}
                disabled={rankedCount === 0}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors text-left disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <HugeiconsIcon icon={RotateLeft01Icon} size={14} />
                <span>Reset All to Vault</span>
              </button>
            </PopoverContent>
          </Popover>

          {/* Theme Toggle (Dark / Light) */}
          <SimpleTooltip content={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'} side="top">
            <button
              type="button"
              onClick={toggleTheme}
              className="p-1.5 sm:p-2 rounded-xl bg-secondary/80 hover:bg-accent text-muted-foreground hover:text-foreground border border-border/70 transition-all active:scale-90 cursor-pointer"
            >
              <HugeiconsIcon
                icon={theme === 'dark' ? Sun01Icon : Moon02Icon}
                size={15}
                className={theme === 'dark' ? 'text-amber-400' : 'text-slate-700'}
              />
            </button>
          </SimpleTooltip>
        </div>
      </aside>

      {/* Reset Board Confirmation Modal */}
      <ConfirmModal
        open={isResetConfirmOpen}
        onOpenChange={setIsResetConfirmOpen}
        title="Reset All Items to Vault?"
        description="This will remove all placed items from the tiers and return them back to the unranked vault."
        confirmText="Reset Board"
        cancelText="Cancel"
        variant="destructive"
        onConfirm={resetAllToPool}
      />
    </>
  )
}
