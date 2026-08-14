import { useMemo } from 'react'
import { useDroppable } from '@dnd-kit/react'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Search01Icon,
  PlusSignIcon,
  ShuffleIcon,
  RotateLeft01Icon,
  DicesIcon,
  FolderAddIcon,
  Tick02Icon,
  SparklesIcon,
} from '@hugeicons/core-free-icons'
import { useUiStore } from '../store/useUiStore'
import { useTierDataStore } from '../store/useTierDataStore'
import DraggableItem from './DraggableItem'
import { SimpleTooltip } from './ui/tooltip'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Badge } from './ui/badge'

export default function ItemsList() {
  const { ref, isDropTarget } = useDroppable({
    id: 'POOL',
  })

  const searchQuery = useUiStore((s) => s.searchQuery)
  const selectedCategory = useUiStore((s) => s.selectedCategory)
  const setSearchQuery = useUiStore((s) => s.setSearchQuery)
  const setSelectedCategory = useUiStore((s) => s.setSelectedCategory)
  const setAddItemOpen = useUiStore((s) => s.setAddItemOpen)
  const setRandomPickerOpen = useUiStore((s) => s.setRandomPickerOpen)
  const previewMode = useUiStore((s) => s.previewMode)

  const items = useTierDataStore((s) => s.items)
  const containers = useTierDataStore((s) => s.containers)
  const shufflePool = useTierDataStore((s) => s.shufflePool)
  const resetAllToPool = useTierDataStore((s) => s.resetAllToPool)

  const poolItemIds = useMemo(() => containers['POOL'] || [], [containers])
  const totalItems = items.length
  const rankedCount = totalItems - poolItemIds.length
  const percentRanked = totalItems > 0 ? Math.round((rankedCount / totalItems) * 100) : 0

  // Extract unique categories from items
  const categories = useMemo(() => {
    const cats = new Set<string>()
    items.forEach((it) => {
      if (it.category) cats.add(it.category)
    })
    return Array.from(cats)
  }, [items])

  // Filter pool items by search query and category
  const filteredPoolItems = useMemo(() => {
    return poolItemIds
      .map((id) => items.find((it) => it.id === id))
      .filter((it): it is NonNullable<typeof it> => {
        if (!it) return false
        const matchesSearch = it.title
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
        const matchesCategory =
          !selectedCategory || it.category === selectedCategory
        return matchesSearch && matchesCategory
      })
  }, [poolItemIds, items, searchQuery, selectedCategory])

  if (previewMode) return null

  return (
    <div className="w-full max-w-7xl mx-auto mt-4 sm:mt-6">
      <div className="bg-card border border-border rounded-xl p-3.5 sm:p-5 shadow-lg space-y-3.5 transition-colors">
        {/* Vault Header Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-secondary border border-border text-foreground">
              <HugeiconsIcon icon={FolderAddIcon} size={16} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-sm sm:text-base text-foreground tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
                  Unranked Item Vault
                </h2>
                <Badge variant="secondary" className="text-[10px] font-mono font-bold px-1.5 py-0">
                  {poolItemIds.length} left
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Drag tiles onto the board or click 3-dots on any card to quick-place.
              </p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {/* Streamer Roulette Random Picker Button */}
            <SimpleTooltip content="Spin random item for stream / audience ranking" shortcut="R" side="top">
              <Button
                size="sm"
                onClick={() => setRandomPickerOpen(true)}
                disabled={poolItemIds.length === 0}
                className="bg-rose-600 hover:bg-rose-500 text-white font-bold gap-1.5 h-8 text-xs shadow-xs active:scale-95 transition-transform"
              >
                <HugeiconsIcon icon={DicesIcon} size={15} />
                <span>Roulette</span>
              </Button>
            </SimpleTooltip>

            {/* Add Custom Item Modal Trigger */}
            <SimpleTooltip content="Add item from Wikipedia search, URL, or bulk list" shortcut="N" side="top">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setAddItemOpen(true)}
                className="font-bold gap-1.5 h-8 text-xs bg-secondary border-border active:scale-95 transition-transform"
              >
                <HugeiconsIcon icon={PlusSignIcon} size={15} />
                <span>Add Item</span>
              </Button>
            </SimpleTooltip>

            {/* Shuffle Pool */}
            <SimpleTooltip content="Shuffle vault order" side="top">
              <Button
                variant="outline"
                size="sm"
                onClick={shufflePool}
                disabled={poolItemIds.length <= 1}
                className="bg-secondary border-border px-2 h-8 active:scale-95"
              >
                <HugeiconsIcon icon={ShuffleIcon} size={15} />
              </Button>
            </SimpleTooltip>

            {/* Reset All Items to Pool */}
            <SimpleTooltip content="Clear board and return all items back into vault" side="top">
              <Button
                variant="outline"
                size="sm"
                onClick={resetAllToPool}
                className="bg-secondary border-border text-amber-500 hover:text-amber-600 hover:bg-amber-500/10 gap-1.5 h-8 text-xs active:scale-95"
              >
                <HugeiconsIcon icon={RotateLeft01Icon} size={13} />
                <span className="hidden sm:inline">Reset Board</span>
              </Button>
            </SimpleTooltip>
          </div>
        </div>

        {/* Progress Metric Bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
            <span className="flex items-center gap-1">
              <HugeiconsIcon icon={SparklesIcon} size={12} className="text-rose-500" />
              <span>Completion</span>
            </span>
            <span className="font-mono font-bold text-foreground text-[11px]">
              {rankedCount} / {totalItems} items ({percentRanked}%)
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-secondary overflow-hidden border border-border">
            <div
              style={{ width: `${percentRanked}%` }}
              className="h-full bg-rose-500 rounded-full transition-all duration-300 ease-out"
            />
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-1">
          {/* Search Box */}
          <div className="relative flex-1 max-w-sm">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground">
              <HugeiconsIcon icon={Search01Icon} size={14} />
            </span>
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search vault items..."
              className="pl-8 h-8 text-xs bg-secondary border-border"
            />
          </div>

          {/* Category Filter Pills */}
          {categories.length > 1 && (
            <div className="flex flex-wrap items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
              <button
                type="button"
                onClick={() => setSelectedCategory(null)}
                className={`px-2.5 py-1 text-[11px] font-mono font-semibold rounded-md transition-all active:scale-95 ${
                  selectedCategory === null
                    ? 'bg-foreground text-background'
                    : 'bg-secondary text-muted-foreground hover:text-foreground border border-border'
                }`}
              >
                All ({poolItemIds.length})
              </button>
              {categories.map((cat) => {
                const count = poolItemIds.filter(
                  (id) => items.find((it) => it.id === id)?.category === cat,
                ).length
                if (count === 0) return null
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() =>
                      setSelectedCategory(selectedCategory === cat ? null : cat)
                    }
                    className={`px-2.5 py-1 text-[11px] font-mono font-semibold rounded-md transition-all active:scale-95 ${
                      selectedCategory === cat
                        ? 'bg-rose-600 text-white'
                        : 'bg-secondary text-muted-foreground hover:text-foreground border border-border'
                    }`}
                  >
                    {cat} ({count})
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Droppable Vault Surface */}
        <div
          ref={ref}
          className={`min-h-[120px] p-2.5 sm:p-3 rounded-lg border flex flex-wrap gap-2 sm:gap-2.5 items-center content-start transition-all duration-150 ${
            isDropTarget
              ? 'bg-accent/60 border-rose-500/80 ring-2 ring-rose-500/20'
              : 'bg-background/50 border-border/80'
          }`}
        >
          {poolItemIds.length === 0 ? (
            <div className="w-full py-8 flex flex-col items-center justify-center text-center space-y-1.5">
              <div className="w-9 h-9 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                <HugeiconsIcon icon={Tick02Icon} size={20} />
              </div>
              <h4 className="font-bold text-foreground text-xs sm:text-sm">
                All Items Have Been Placed
              </h4>
              <p className="text-xs text-muted-foreground max-w-sm">
                Every tile has been assigned a grade. You can export your list or add custom cards.
              </p>
              <Button
                variant="outline"
                size="xs"
                onClick={() => setAddItemOpen(true)}
                className="mt-1 text-xs font-semibold active:scale-95 h-7"
              >
                + Add Another Item
              </Button>
            </div>
          ) : filteredPoolItems.length === 0 ? (
            <div className="w-full py-8 text-center text-muted-foreground text-xs font-mono">
              No vault items match "{searchQuery}".
            </div>
          ) : (
            filteredPoolItems.map((item) => (
              <DraggableItem
                key={item.id}
                item={item}
                currentContainerId="POOL"
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
