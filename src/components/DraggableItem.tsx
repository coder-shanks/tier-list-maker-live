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
import { useTierListStore } from '../store/useTierListStore'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
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
  const { ref, isDragging: dndIsDragging } = useDraggable({
    id: item.id,
  })

  const isDragging = propIsDragging || dndIsDragging
  const [imgError, setImgError] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(item.title)
  const [editCategory, setEditCategory] = useState(item.category || 'Custom')

  const {
    itemSize,
    tiers,
    moveItemToTier,
    deleteItem,
    updateItem,
    previewMode,
  } = useTierListStore()

  // Generate deterministic rich gradient for items without valid image
  const getGradient = (name: string) => {
    const gradients = [
      'from-rose-600 via-rose-500 to-amber-500',
      'from-amber-600 via-orange-500 to-yellow-400',
      'from-emerald-600 via-teal-500 to-cyan-500',
      'from-blue-600 via-indigo-600 to-violet-600',
      'from-violet-600 via-purple-600 to-fuchsia-600',
      'from-fuchsia-600 via-pink-600 to-rose-500',
      'from-cyan-600 via-sky-600 to-indigo-600',
    ]
    let hash = 0
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash)
    }
    return gradients[Math.abs(hash) % gradients.length]
  }

  // Size dimensions
  const sizeClasses = {
    compact: 'w-16 h-16 text-xs',
    normal: 'w-20 h-20 text-xs sm:w-22 sm:h-22',
    large: 'w-24 h-24 text-sm sm:w-28 sm:h-28',
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
      className={`group relative select-none rounded-xl overflow-hidden transition-all duration-200 cursor-grab active:cursor-grabbing border ${
        isOverlay
          ? 'scale-105 rotate-2 shadow-2xl shadow-indigo-500/40 border-indigo-400 ring-4 ring-indigo-500/30 z-50 pointer-events-none'
          : isDragging
          ? 'opacity-25 scale-95 border-dashed border-indigo-400/80 ring-2 ring-indigo-500/40 shadow-inner'
          : 'opacity-100 shadow-md hover:shadow-xl hover:shadow-indigo-500/20 border-zinc-300/40 dark:border-white/10 hover:border-indigo-400 dark:hover:border-indigo-400/80 hover:scale-[1.04] active:scale-95'
      } ${sizeClasses}`}
    >
      {/* Background Image with Fallback */}
      {item.imageUrl && !imgError ? (
        <img
          src={item.imageUrl}
          alt={item.title}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      ) : (
        <div
          className={`w-full h-full bg-linear-to-br ${getGradient(
            item.title,
          )} flex flex-col items-center justify-center p-1.5 text-center font-black text-white shadow-inner relative`}
        >
          <span className="text-sm sm:text-base tracking-wider uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-mono">
            {item.title.slice(0, 3)}
          </span>
          {item.category && (
            <span className="text-[8px] uppercase tracking-widest text-white/75 mt-0.5 max-w-[90%] truncate">
              {item.category}
            </span>
          )}
        </div>
      )}

      {/* Subtle Dark Vignette / Gradient Overlay for High Readability */}
      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />

      {/* Item Title Label */}
      <div className="absolute bottom-0 inset-x-0 p-1 sm:p-1.5 pointer-events-none">
        <p
          className="font-bold text-white text-[10px] sm:text-xs leading-tight line-clamp-2 drop-shadow-[0_1px_3px_rgba(0,0,0,0.95)] text-center tracking-tight"
          title={item.title}
        >
          {item.title}
        </p>
      </div>

      {/* Category Tag pill (for large mode) */}
      {itemSize === 'large' && item.category && (
        <div className="absolute top-1 left-1 pointer-events-none">
          <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-md bg-black/70 backdrop-blur-xs text-zinc-200 border border-white/10 shadow-xs">
            {item.category}
          </span>
        </div>
      )}

      {/* Quick Action Menu Trigger (Hidden in Preview / Overlay mode) */}
      {!previewMode && !isOverlay && (
        <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Popover open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <PopoverTrigger
              render={
                <button
                  type="button"
                  onClick={(e) => e.stopPropagation()}
                  className="p-1 rounded-md bg-black/80 hover:bg-black text-white/90 hover:text-white backdrop-blur-xs shadow-md border border-white/20 active:scale-90 transition-transform"
                  title="Item Options"
                >
                  <HugeiconsIcon icon={MoreVerticalIcon} size={14} />
                </button>
              }
            />
            <PopoverContent
              side="bottom"
              align="start"
              className="w-56 p-3 space-y-2.5 shadow-2xl"
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
                    <Button
                      type="submit"
                      size="xs"
                      className="h-6 text-[11px]"
                    >
                      <HugeiconsIcon icon={Tick02Icon} size={12} />
                      Save
                    </Button>
                  </div>
                </form>
              ) : (
                <>
                  {/* Quick Move to Tiers */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                      Move to Tier:
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
                          style={{ backgroundColor: t.color, color: t.textColor || '#fff' }}
                          className="px-1.5 py-1 text-[11px] font-bold rounded-md shadow-2xs hover:opacity-90 active:scale-95 transition-transform truncate"
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
                        <HugeiconsIcon icon={RotateLeft01Icon} size={12} className="text-amber-500" />
                        Send to Pool
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
