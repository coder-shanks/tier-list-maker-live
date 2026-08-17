import { useState, useEffect, useRef } from 'react'
import confetti from 'canvas-confetti'
import { HugeiconsIcon } from '@hugeicons/react'
import { DicesIcon, RotateLeft01Icon, SparklesIcon } from '@hugeicons/core-free-icons'
import { useUiStore } from '../store/useUiStore'
import { useTierDataStore } from '../store/useTierDataStore'
import { useBlindStore } from '../store/useBlindStore'
import type { TierItem } from '../lib/types'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

function RandomPickerContent({ onClose }: { onClose: () => void }) {
  const items = useTierDataStore((s) => s.items)
  const containers = useTierDataStore((s) => s.containers)
  const tiers = useTierDataStore((s) => s.tiers)
  const moveItemToTier = useTierDataStore((s) => s.moveItemToTier)

  const poolItemIds = containers['POOL'] || []
  const poolItems = poolItemIds
    .map((id) => items.find((it) => it.id === id))
    .filter((it): it is TierItem => Boolean(it))

  const [selectedItem, setSelectedItem] = useState<TierItem | null>(null)
  const [isSpinning, setIsSpinning] = useState(true)
  const [displayedItem, setDisplayedItem] = useState<TierItem | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const startSpinAnimation = () => {
    if (poolItems.length === 0) return
    setIsSpinning(true)
    setSelectedItem(null)

    let counter = 0
    const totalSteps = 18
    if (intervalRef.current) clearInterval(intervalRef.current)

    intervalRef.current = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * poolItems.length)
      setDisplayedItem(poolItems[randomIndex])
      counter++

      if (counter >= totalSteps) {
        if (intervalRef.current) clearInterval(intervalRef.current)
        const finalItem = poolItems[Math.floor(Math.random() * poolItems.length)]
        setSelectedItem(finalItem)
        setDisplayedItem(finalItem)
        setIsSpinning(false)

        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#e11d48', '#ea580c', '#d97706', '#059669', '#0284c7', '#7c3aed'],
        })
      }
    }, 75)
  }

  // Initial spin on mount
  useEffect(() => {
    if (poolItems.length === 0) {
      return
    }

    let counter = 0
    const totalSteps = 18
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
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#e11d48', '#ea580c', '#d97706', '#059669', '#0284c7', '#7c3aed'],
        })
      }
    }, 75)

    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleAssignAndNext = (tierId: string) => {
    if (!selectedItem) return
    moveItemToTier(selectedItem.id, tierId)
    setSelectedItem(null)
    setDisplayedItem(null)

    const remainingCount = poolItemIds.filter((id) => id !== selectedItem.id).length
    if (remainingCount > 0) {
      setTimeout(() => {
        startSpinAnimation()
      }, 120)
    } else {
      onClose()
    }
  }

  return (
    <div className="py-3 flex flex-col items-center justify-center space-y-3.5">
      {/* Item Slot Box */}
      <div
        className={`w-36 h-36 rounded-xl overflow-hidden border relative flex items-center justify-center bg-zinc-950 transition-all duration-150 ${
          isSpinning
            ? 'scale-95 border-rose-500 ring-4 ring-rose-500/30'
            : selectedItem
              ? 'scale-105 border-foreground ring-2 ring-foreground/20 shadow-xl'
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
              <div className="w-full h-full bg-zinc-900 flex flex-col items-center justify-center text-zinc-100 font-mono font-black text-2xl p-2 text-center">
                <span>{displayedItem.title.slice(0, 3).toUpperCase()}</span>
              </div>
            )}
            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />
            <div className="absolute bottom-2 inset-x-2 text-center pointer-events-none">
              <p className="text-xs font-bold text-white truncate drop-shadow-md">
                {displayedItem.title}
              </p>
              {displayedItem.category && (
                <span className="text-[9px] font-mono text-zinc-300">
                  {displayedItem.category}
                </span>
              )}
            </div>
          </>
        ) : (
          <div className="text-muted-foreground text-xs font-mono text-center p-4">
            No items remaining in vault!
          </div>
        )}

        {isSpinning && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center">
            <span className="text-white text-xs font-mono font-bold animate-pulse flex items-center gap-1.5">
              <HugeiconsIcon icon={SparklesIcon} size={13} className="text-rose-500" />
              Spinning...
            </span>
          </div>
        )}
      </div>

      {/* Winning item announcement */}
      {selectedItem && !isSpinning && (
        <div className="text-center animate-in fade-in zoom-in-95 duration-150">
          <h3
            className="font-black text-base text-foreground"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {selectedItem.title}
          </h3>
          <p className="text-xs text-muted-foreground font-mono">Assign to tier:</p>
        </div>
      )}

      {/* Quick Assign Buttons */}
      {selectedItem && !isSpinning && (
        <div className="w-full space-y-1.5 pt-1">
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-1 w-full">
            {tiers.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => handleAssignAndNext(t.id)}
                style={{ backgroundColor: t.color, color: t.textColor || '#ffffff' }}
                className="p-2 text-xs font-bold rounded-lg shadow-sm hover:scale-105 active:scale-95 transition-all text-center truncate cursor-pointer"
                title={`Assign to ${t.title}`}
              >
                {t.title.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Spin Again Controls */}
      <div className="flex gap-2 pt-1">
        <Button
          variant="outline"
          size="sm"
          onClick={startSpinAnimation}
          disabled={isSpinning || poolItems.length === 0}
          className="gap-1.5 font-semibold text-xs active:scale-95 h-8"
        >
          <HugeiconsIcon icon={RotateLeft01Icon} size={14} />
          <span>Respin Roulette</span>
        </Button>
      </div>
    </div>
  )
}

export default function RandomPickerModal() {
  const isBlindActive = useBlindStore((s) => s.isActive)
  const isRandomPickerOpen = useUiStore((s) => s.isRandomPickerOpen)
  const setRandomPickerOpen = useUiStore((s) => s.setRandomPickerOpen)

  const effectiveOpen = isRandomPickerOpen && !isBlindActive

  return (
    <Dialog open={effectiveOpen} onOpenChange={setRandomPickerOpen}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-500">
              <HugeiconsIcon icon={DicesIcon} size={18} />
            </div>
            <div>
              <DialogTitle
                className="text-base font-bold"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Streamer Roulette Picker
              </DialogTitle>
              <DialogDescription className="text-xs">
                Spins a random unranked item for you or your community to judge.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {isRandomPickerOpen && (
          <RandomPickerContent onClose={() => setRandomPickerOpen(false)} />
        )}
      </DialogContent>
    </Dialog>
  )
}
