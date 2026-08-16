import { useMemo } from 'react'
import { useDroppable } from '@dnd-kit/react'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Search01Icon,
  PlusSignIcon,
  ShuffleIcon,
  FolderAddIcon,
  Tick02Icon,
} from '@hugeicons/core-free-icons'
import { useUiStore } from '../store/useUiStore'
import { useTierDataStore } from '../store/useTierDataStore'
import { useBlindStore } from '../store/useBlindStore'
import DraggableItem from './DraggableItem'
import BlindSpotlightArena from './BlindSpotlightArena'
import { SimpleTooltip } from './ui/tooltip'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Badge } from './ui/badge'

export default function ItemsList() {
  const isBlindActive = useBlindStore((s) => s.isActive)

  const { ref, isDropTarget } = useDroppable({
    id: 'POOL',
  })

  const searchQuery = useUiStore((s) => s.searchQuery)
  const selectedCategory = useUiStore((s) => s.selectedCategory)
  const setSearchQuery = useUiStore((s) => s.setSearchQuery)
  const setSelectedCategory = useUiStore((s) => s.setSelectedCategory)
  const setAddItemOpen = useUiStore((s) => s.setAddItemOpen)
  const previewMode = useUiStore((s) => s.previewMode)

  const items = useTierDataStore((s) => s.items)
  const containers = useTierDataStore((s) => s.containers)
  const shufflePool = useTierDataStore((s) => s.shufflePool)

  const poolItemIds = useMemo(() => containers['POOL'] || [], [containers])

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

  // If Blind Challenge Mode is active, show the specialized arena
  if (isBlindActive) {
    return <BlindSpotlightArena />
  }

  return (
    <div className="w-full max-w-7xl mx-auto mt-4 sm:mt-6">
      <div className="bg-card border border-border rounded-xl p-3.5 sm:p-5 shadow-lg space-y-3.5 transition-colors">
        {/* Vault Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-secondary border border-border text-foreground">
              <HugeiconsIcon icon={FolderAddIcon} size={16} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-sm sm:text-base text-foreground tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
                  Unranked Item Vault
                </h2>
                <Badge variant="secondary" className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md">
                  {poolItemIds.length} left
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Drag tiles onto the board or click 3-dots on any tile to place.
              </p>
            </div>
          </div>

          {/* Quick Add & Shuffle Utilities */}
          <div className="flex items-center gap-2">
            <SimpleTooltip content="Shuffle vault order" side="top">
              <Button
                variant="outline"
                size="sm"
                onClick={shufflePool}
                disabled={poolItemIds.length <= 1}
                className="bg-secondary hover:bg-accent border-border/80 px-2.5 h-8 active:scale-95 rounded-xl cursor-pointer text-xs font-semibold gap-1.5"
              >
                <HugeiconsIcon icon={ShuffleIcon} size={14} />
                <span className="hidden sm:inline">Shuffle</span>
              </Button>
            </SimpleTooltip>

            <SimpleTooltip content="Add item from Wikipedia search, URL, or custom text (N)" shortcut="N" side="top">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setAddItemOpen(true)}
                className="font-bold gap-1.5 h-8 text-xs bg-secondary hover:bg-accent border-border/80 active:scale-95 transition-transform rounded-xl cursor-pointer"
              >
                <HugeiconsIcon icon={PlusSignIcon} size={14} />
                <span>Add Item</span>
              </Button>
            </SimpleTooltip>
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
              className="pl-8 h-8 text-xs bg-secondary/70 border-border rounded-xl"
            />
          </div>

          {/* Category Filter Pills */}
          {categories.length > 1 && (
            <div className="flex flex-wrap items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
              <button
                type="button"
                onClick={() => setSelectedCategory(null)}
                className={`px-2.5 py-1 text-[11px] font-mono font-semibold rounded-lg transition-all active:scale-95 cursor-pointer ${
                  selectedCategory === null
                    ? 'bg-foreground text-background'
                    : 'bg-secondary text-muted-foreground hover:text-foreground border border-border/70'
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
                    className={`px-2.5 py-1 text-[11px] font-mono font-semibold rounded-lg transition-all active:scale-95 cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-rose-600 text-white'
                        : 'bg-secondary text-muted-foreground hover:text-foreground border border-border/70'
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

