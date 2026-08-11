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
import { useTierListStore } from '../store/useTierListStore'
import DraggableItem from './DraggableItem'
import { SimpleTooltip } from './ui/tooltip'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Badge } from './ui/badge'

export default function ItemsList() {
  const { ref, isDropTarget } = useDroppable({
    id: 'POOL',
  })

  const {
    items,
    containers,
    searchQuery,
    selectedCategory,
    setSearchQuery,
    setSelectedCategory,
    shufflePool,
    resetAllToPool,
    setAddItemOpen,
    setRandomPickerOpen,
    previewMode,
  } = useTierListStore()

  const poolItemIds = containers['POOL'] || []
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
    <div className="w-full max-w-7xl mx-auto mt-6">
      <div className="bg-white dark:bg-zinc-950/90 border border-zinc-200 dark:border-zinc-800/90 rounded-2xl p-4 sm:p-5 shadow-xl dark:shadow-2xl backdrop-blur-xl space-y-4 transition-colors">
        {/* Pool Header Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-zinc-200 dark:border-zinc-800/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400">
              <HugeiconsIcon icon={FolderAddIcon} size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-base sm:text-lg text-zinc-900 dark:text-white tracking-tight">
                  Unassigned Items Pool
                </h2>
                <Badge variant="secondary" className="text-xs font-mono font-bold">
                  {poolItemIds.length} remaining
                </Badge>
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                Drag any item to rank it onto the board, or click the 3-dots to quick-assign.
              </p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Streamer Roulette Random Picker Button */}
            <SimpleTooltip content="Spin random unassigned item to rank" shortcut="R" side="top">
              <Button
                size="sm"
                onClick={() => setRandomPickerOpen(true)}
                disabled={poolItemIds.length === 0}
                className="bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold gap-1.5 shadow-md shadow-indigo-500/20 active:scale-95 transition-transform"
              >
                <HugeiconsIcon icon={DicesIcon} size={16} />
                <span>Streamer Roulette</span>
              </Button>
            </SimpleTooltip>

            {/* Add Custom Item Modal Trigger */}
            <SimpleTooltip content="Add custom item, search open-source images, or bulk add" shortcut="N" side="top">
              <Button
                size="sm"
                onClick={() => setAddItemOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold gap-1.5 shadow-md shadow-indigo-600/20 active:scale-95 transition-transform"
              >
                <HugeiconsIcon icon={PlusSignIcon} size={16} />
                <span>Add Item</span>
              </Button>
            </SimpleTooltip>

            {/* Shuffle Pool */}
            <SimpleTooltip content="Shuffle unassigned items order" side="top">
              <Button
                variant="outline"
                size="sm"
                onClick={shufflePool}
                disabled={poolItemIds.length <= 1}
                className="bg-zinc-100 dark:bg-zinc-900 border-zinc-300 dark:border-zinc-800 px-2.5 active:scale-95"
              >
                <HugeiconsIcon icon={ShuffleIcon} size={16} />
              </Button>
            </SimpleTooltip>

            {/* Reset All Items to Pool */}
            <SimpleTooltip content="Return all ranked items back into this pool" side="top">
              <Button
                variant="outline"
                size="sm"
                onClick={resetAllToPool}
                className="bg-zinc-100 dark:bg-zinc-900 border-zinc-300 dark:border-zinc-800 text-amber-600 dark:text-amber-400 gap-1.5 active:scale-95"
              >
                <HugeiconsIcon icon={RotateLeft01Icon} size={14} />
                <span className="hidden sm:inline">Reset Board</span>
              </Button>
            </SimpleTooltip>
          </div>
        </div>

        {/* Live Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            <span className="flex items-center gap-1">
              <HugeiconsIcon icon={SparklesIcon} size={13} className="text-indigo-500" />
              Ranking Progress
            </span>
            <span className="font-mono font-bold text-zinc-800 dark:text-zinc-200">
              {rankedCount} of {totalItems} items ({percentRanked}%)
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-zinc-100 dark:bg-zinc-900 overflow-hidden border border-zinc-200 dark:border-zinc-800">
            <div
              style={{ width: `${percentRanked}%` }}
              className="h-full bg-linear-to-r from-indigo-500 via-purple-500 to-emerald-500 rounded-full transition-all duration-500 ease-out"
            />
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-1">
          {/* Search Box */}
          <div className="relative flex-1 max-w-sm">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500">
              <HugeiconsIcon icon={Search01Icon} size={15} />
            </span>
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search unassigned items..."
              className="pl-9 h-8 text-xs bg-zinc-50 dark:bg-zinc-900/90 border-zinc-300 dark:border-zinc-800"
            />
          </div>

          {/* Category Filter Pills */}
          {categories.length > 1 && (
            <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              <button
                type="button"
                onClick={() => setSelectedCategory(null)}
                className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-all active:scale-95 ${
                  selectedCategory === null
                    ? 'bg-zinc-900 dark:bg-zinc-200 text-white dark:text-black'
                    : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 border border-zinc-200 dark:border-zinc-800'
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
                    className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-all active:scale-95 ${
                      selectedCategory === cat
                        ? 'bg-indigo-600 text-white'
                        : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 border border-zinc-200 dark:border-zinc-800'
                    }`}
                  >
                    {cat} ({count})
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Draggable Drop Zone Area */}
        <div
          ref={ref}
          className={`min-h-[140px] p-3 sm:p-4 rounded-xl border flex flex-wrap gap-2.5 items-center content-start transition-all duration-200 ${
            isDropTarget
              ? 'bg-indigo-50/80 dark:bg-indigo-950/30 border-indigo-400 ring-2 ring-indigo-500/20'
              : 'bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800/80'
          }`}
        >
          {poolItemIds.length === 0 ? (
            <div className="w-full py-10 flex flex-col items-center justify-center text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <HugeiconsIcon icon={Tick02Icon} size={24} />
              </div>
              <h4 className="font-bold text-zinc-900 dark:text-white text-sm">
                All Items Have Been Ranked! 🎉
              </h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm">
                Every item is assigned to a tier. You can export your tier list or add more custom items below.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAddItemOpen(true)}
                className="mt-2 text-xs font-semibold active:scale-95"
              >
                + Add Another Item
              </Button>
            </div>
          ) : filteredPoolItems.length === 0 ? (
            <div className="w-full py-8 text-center text-zinc-400 dark:text-zinc-500 text-xs">
              No items match your current search or category filter.
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
