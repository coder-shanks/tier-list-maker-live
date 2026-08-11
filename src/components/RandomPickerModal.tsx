import { useState, useEffect } from 'react'
import confetti from 'canvas-confetti'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  DicesIcon,
  RotateLeft01Icon,
  SparklesIcon,
} from '@hugeicons/core-free-icons'
import { useTierListStore } from '../store/useTierListStore'
import type { TierItem } from '../lib/types'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

export default function RandomPickerModal() {
  const {
    isRandomPickerOpen,
    setRandomPickerOpen,
    items,
    containers,
    tiers,
    moveItemToTier,
  } = useTierListStore()

  const poolItemIds = containers['POOL'] || []
  const poolItems = poolItemIds
    .map((id) => items.find((it) => it.id === id))
    .filter((it): it is TierItem => Boolean(it))

  const [selectedItem, setSelectedItem] = useState<TierItem | null>(null)
  const [isSpinning, setIsSpinning] = useState(false)
  const [displayedItem, setDisplayedItem] = useState<TierItem | null>(null)

  const handleSpin = () => {
    if (poolItems.length === 0 || isSpinning) return
    setIsSpinning(true)
    setSelectedItem(null)

    let counter = 0
    const totalSteps = 22
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * poolItems.length)
      setDisplayedItem(poolItems[randomIndex])
      counter++

      if (counter >= totalSteps) {
        clearInterval(interval)
        const finalItem = poolItems[Math.floor(Math.random() * poolItems.length)]
        setSelectedItem(finalItem)
        setDisplayedItem(finalItem)
        setIsSpinning(false)

        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'],
        })
      }
    }, 75)
  }

  useEffect(() => {
    if (
      isRandomPickerOpen &&
      poolItems.length > 0 &&
      !selectedItem &&
      !isSpinning
    ) {
      handleSpin()
    }
  }, [isRandomPickerOpen])

  if (!isRandomPickerOpen) return null

  const handleAssignAndNext = (tierId: string) => {
    if (!selectedItem) return
    moveItemToTier(selectedItem.id, tierId)
    setSelectedItem(null)
    setDisplayedItem(null)

    // Check if remaining pool items exist
    const remainingCount = poolItemIds.filter(
      (id) => id !== selectedItem.id,
    ).length
    if (remainingCount > 0) {
      setTimeout(() => {
        handleSpin()
      }, 150)
    } else {
      setRandomPickerOpen(false)
    }
  }

  return (
    <Dialog open={isRandomPickerOpen} onOpenChange={setRandomPickerOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <HugeiconsIcon icon={DicesIcon} size={20} />
            </div>
            <div>
              <DialogTitle className="text-base font-bold">
                Streamer Roulette Picker
              </DialogTitle>
              <DialogDescription className="text-xs">
                Randomly picks an unranked item for you or your chat to decide.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-4 flex flex-col items-center justify-center space-y-4">
          {/* Item Slot Box */}
          <div
            className={`w-40 h-40 rounded-2xl overflow-hidden border-2 shadow-2xl relative flex items-center justify-center bg-zinc-950 transition-all duration-200 ${
              isSpinning
                ? 'scale-95 border-purple-500 ring-4 ring-purple-500/30'
                : selectedItem
                ? 'scale-105 border-indigo-400 ring-4 ring-indigo-500/40'
                : 'border-border'
            }`}
          >
            {displayedItem ? (
              <>
                {displayedItem.imageUrl ? (
                  <img
                    src={displayedItem.imageUrl}
                    alt={displayedItem.title}
                    crossOrigin="anonymous"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-linear-to-tr from-indigo-600 via-purple-600 to-pink-500 flex flex-col items-center justify-center text-white font-black text-2xl p-2 text-center">
                    <span>{displayedItem.title.slice(0, 3).toUpperCase()}</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent" />
                <div className="absolute bottom-2 inset-x-2 text-center">
                  <p className="text-xs font-bold text-white truncate drop-shadow-md">
                    {displayedItem.title}
                  </p>
                  {displayedItem.category && (
                    <span className="text-[9px] text-zinc-300 font-medium">
                      {displayedItem.category}
                    </span>
                  )}
                </div>
              </>
            ) : (
              <div className="text-muted-foreground text-xs font-medium text-center p-4">
                No items remaining in the pool!
              </div>
            )}

            {isSpinning && (
              <div className="absolute inset-0 bg-purple-950/40 backdrop-blur-xs flex items-center justify-center">
                <span className="text-white text-xs font-bold animate-pulse flex items-center gap-1">
                  <HugeiconsIcon icon={SparklesIcon} size={14} className="animate-spin" />
                  Spinning...
                </span>
              </div>
            )}
          </div>

          {/* Winning item announcement */}
          {selectedItem && !isSpinning && (
            <div className="text-center animate-in fade-in zoom-in-95 duration-200">
              <h3 className="font-extrabold text-sm sm:text-base text-foreground">
                {selectedItem.title}
              </h3>
              <p className="text-xs text-muted-foreground">
                Where does this belong? Pick a tier below:
              </p>
            </div>
          )}

          {/* Quick Assign Buttons */}
          {selectedItem && !isSpinning && (
            <div className="w-full space-y-2 pt-2">
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 w-full">
                {tiers.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => handleAssignAndNext(t.id)}
                    style={{ backgroundColor: t.color, color: t.textColor || '#ffffff' }}
                    className="p-2 text-xs font-bold rounded-xl shadow-md hover:scale-105 active:scale-95 transition-all text-center truncate drop-shadow-xs"
                    title={`Assign to ${t.title}`}
                  >
                    {t.title.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Spin Again Controls */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSpin}
              disabled={isSpinning || poolItems.length === 0}
              className="gap-1.5 font-semibold text-xs active:scale-95"
            >
              <HugeiconsIcon icon={RotateLeft01Icon} size={14} />
              <span>Respin Roulette</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
