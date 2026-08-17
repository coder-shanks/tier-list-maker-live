import React, { useState } from 'react'
import { useDraggable } from '@dnd-kit/react'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  MoreVerticalIcon,
  Delete02Icon,
  RotateLeft01Icon,
  Edit02Icon,
  Tick02Icon,
} from '@hugeicons/core-free-icons'
import type { TierItem } from '../lib/types'
import { useUiStore } from '../store/useUiStore'
import { useTierDataStore } from '../store/useTierDataStore'
import { useBlindStore } from '../store/useBlindStore'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

type DraggableItemProps = {
  item: TierItem
  currentContainerId?: string
  isDragging?: boolean
  isOverlay?: boolean
}

export default function DraggableItem({
  item,
  currentContainerId,
  isDragging: propIsDragging = false,
  isOverlay = false,
}: DraggableItemProps) {
  const isLocked = useBlindStore((s) => s.isActive && s.lockedItemIds.includes(item.id))

  const { ref, isDragging: dndIsDragging } = useDraggable({
    id: item.id,
    disabled: isLocked,
  })

  const isDragging = propIsDragging || dndIsDragging
  const [imgError, setImgError] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(item.title)
  const [editCategory, setEditCategory] = useState(item.category || 'Custom')

  const itemSize = useUiStore((s) => s.itemSize)
  const previewMode = useUiStore((s) => s.previewMode)

  const tiers = useTierDataStore((s) => s.tiers)
  const moveItemToTier = useTierDataStore((s) => s.moveItemToTier)
  const deleteItem = useTierDataStore((s) => s.deleteItem)
  const updateItem = useTierDataStore((s) => s.updateItem)

  // Deterministic surface color for items without image (crisp in light and dark mode)
  const getMonogramBg = (name: string) => {
    const tones = [
      'bg-slate-100 text-slate-900 border-slate-300 dark:bg-slate-900 dark:text-slate-200 dark:border-slate-700',
      'bg-zinc-100 text-zinc-900 border-zinc-300 dark:bg-zinc-900 dark:text-zinc-200 dark:border-zinc-700',
      'bg-stone-100 text-stone-900 border-stone-300 dark:bg-stone-900 dark:text-stone-200 dark:border-stone-700',
      'bg-neutral-100 text-neutral-900 border-neutral-300 dark:bg-neutral-900 dark:text-neutral-200 dark:border-neutral-700',
    ]
    let hash = 0
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash)
    }
    return tones[Math.abs(hash) % tones.length]
  }

  // Size dimensions
  const sizeClasses = {
    compact: 'w-16 h-16 text-xs',
    normal: 'w-20 h-20 text-xs sm:w-21 sm:h-21',
    large: 'w-24 h-24 text-sm sm:w-26 sm:h-26',
  }[itemSize]

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editTitle.trim()) {
      updateItem(item.id, {
        title: editTitle.trim(),
        category: editCategory.trim() || 'Custom',
      })
    }
    setIsEditing(false)
  }

  return (
    <div
      ref={isOverlay ? undefined : ref}
      className={`group relative select-none rounded-xl overflow-hidden transition-all duration-150 cursor-grab active:cursor-grabbing border ${
        isOverlay
          ? 'scale-105 rotate-2 tile-rim-overlay border-rose-500 ring-2 ring-rose-500/40 z-50 pointer-events-none'
          : isDragging
            ? 'opacity-20 scale-95 border-dashed border-rose-500/80 ring-1 ring-rose-500/30 shadow-inner'
            : 'opacity-100 tile-rim border-border/80 hover:border-foreground/40 hover:scale-[1.03] active:scale-95'
      } ${sizeClasses}`}
    >
      {/* Tile Image or Monogram */}
      {item.imageUrl && !imgError ? (
        <img
          src={item.imageUrl}
          alt={item.title}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
          loading="lazy"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      ) : (
        <div
          className={`w-full h-full ${getMonogramBg(
            item.title,
          )} flex flex-col items-center justify-center p-1.5 text-center font-mono font-black border relative`}
        >
          <span className="text-base sm:text-lg tracking-wider uppercase drop-shadow-sm">
            {item.title.slice(0, 3)}
          </span>
          {item.category && (
            <span className="text-[8px] uppercase tracking-widest text-muted-foreground mt-0.5 max-w-[90%] truncate">
              {item.category}
            </span>
          )}
        </div>
      )}

      {/* Subtle Bottom Scrim for Title Legibility */}
      <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

      {/* Item Title Label */}
      <div className="absolute bottom-0 inset-x-0 p-1 sm:p-1.5 pointer-events-none">
        <p
          className="font-bold text-white text-[10px] sm:text-[11px] leading-tight line-clamp-2 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] text-center tracking-tight"
          title={item.title}
        >
          {item.title}
        </p>
      </div>

      {/* Category Tag pill (for large mode) */}
      {itemSize === 'large' && item.category && (
        <div className="absolute top-1 left-1 pointer-events-none">
          <span className="text-[9px] font-mono font-semibold px-1.5 py-0.2 rounded bg-black/75 backdrop-blur-xs text-zinc-300 border border-white/10 shadow-xs">
            {item.category}
          </span>
        </div>
      )}

      {/* Locked in Blind Mode Badge */}
      {isLocked && !isOverlay && (
        <div className="absolute top-1 right-1 pointer-events-none z-10">
          <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-black/85 backdrop-blur-xs text-amber-400 border border-amber-500/30 shadow-xs flex items-center gap-0.5">
            <span>🔒</span>
          </span>
        </div>
      )}

      {/* Quick Action Menu Trigger (Hidden in Preview / Overlay / Locked mode) */}
      {!previewMode && !isOverlay && !isLocked && (
        <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Popover open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <PopoverTrigger
              render={
                <button
                  type="button"
                  onClick={(e) => e.stopPropagation()}
                  className="p-1 rounded bg-black/80 hover:bg-black text-white/90 hover:text-white backdrop-blur-xs shadow-md border border-white/20 active:scale-90 transition-transform"
                  title="Item Options"
                >
                  <HugeiconsIcon icon={MoreVerticalIcon} size={13} />
                </button>
              }
            />
            <PopoverContent
              side="bottom"
              align="start"
              className="w-56 p-3 space-y-2.5 shadow-xl border-border bg-popover"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header with Title & Edit Trigger */}
              <div className="flex items-center justify-between border-b border-border pb-1.5 text-xs font-bold text-foreground">
                <span className="truncate max-w-[130px]">{item.title}</span>
                <Button
                  size="icon-xs"
                  variant="ghost"
                  onClick={() => setIsEditing(!isEditing)}
                  title="Edit item name"
                >
                  <HugeiconsIcon icon={Edit02Icon} size={13} />
                </Button>
              </div>

              {/* Edit Form */}
              {isEditing ? (
                <form onSubmit={handleSaveEdit} className="space-y-2 py-1">
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-muted-foreground">
                      Item Name
                    </label>
                    <Input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="h-7 text-xs"
                      autoFocus
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-muted-foreground">
                      Category
                    </label>
                    <Input
                      type="text"
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                      className="h-7 text-xs"
                    />
                  </div>

                  <div className="flex justify-end gap-1 pt-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="xs"
                      onClick={() => setIsEditing(false)}
                      className="h-6 text-[11px]"
                    >
                      Cancel
                    </Button>
                    <Button type="submit" size="xs" className="h-6 text-[11px]">
                      <HugeiconsIcon icon={Tick02Icon} size={12} />
                      Save
                    </Button>
                  </div>
                </form>
              ) : (
                <>
                  {/* Quick Move to Tiers */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-wider">
                      Place in Tier:
                    </span>
                    <div className="grid grid-cols-3 gap-1">
                      {tiers.map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => {
                            moveItemToTier(item.id, t.id)
                            setIsMenuOpen(false)
                          }}
                          style={{
                            backgroundColor: t.color,
                            color: t.textColor || '#fff',
                          }}
                          className="px-1.5 py-1 text-[11px] font-bold rounded shadow-2xs hover:opacity-90 active:scale-95 transition-transform truncate"
                          title={t.title}
                        >
                          {t.title.split(' ')[0]}
                        </button>
                      ))}
                    </div>

                    {currentContainerId !== 'POOL' && (
                      <Button
                        type="button"
                        variant="secondary"
                        size="xs"
                        onClick={() => {
                          moveItemToTier(item.id, 'POOL')
                          setIsMenuOpen(false)
                        }}
                        className="w-full mt-1.5 h-7 text-[11px] gap-1.5"
                      >
                        <HugeiconsIcon
                          icon={RotateLeft01Icon}
                          size={12}
                          className="text-amber-500"
                        />
                        Send to Vault
                      </Button>
                    )}
                  </div>

                  {/* Delete Item */}
                  <div className="pt-1 border-t border-border">
                    <Button
                      type="button"
                      variant="ghost"
                      size="xs"
                      onClick={() => {
                        deleteItem(item.id)
                        setIsMenuOpen(false)
                      }}
                      className="w-full h-7 text-[11px] text-destructive hover:bg-destructive/10 justify-start gap-1.5"
                    >
                      <HugeiconsIcon icon={Delete02Icon} size={13} />
                      Delete Item
                    </Button>
                  </div>
                </>
              )}
            </PopoverContent>
          </Popover>
        </div>
      )}
    </div>
  )
}
