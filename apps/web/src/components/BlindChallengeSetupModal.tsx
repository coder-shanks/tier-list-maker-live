import { useState, useMemo } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  DicesIcon,
  PlayIcon,
  FlameIcon,
  SparklesIcon,
  Layers01Icon,
  MinusSignIcon,
  PlusSignIcon,
} from '@hugeicons/core-free-icons'
import { useUiStore } from '../store/useUiStore'
import { useTierDataStore } from '../store/useTierDataStore'
import { useBlindStore } from '../store/useBlindStore'
import type { BlindChallengeMode } from '../lib/types'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function BlindChallengeSetupModal() {
  const isBlindSetupOpen = useUiStore((s) => s.isBlindSetupOpen)
  const setBlindSetupOpen = useUiStore((s) => s.setBlindSetupOpen)

  const tiers = useTierDataStore((s) => s.tiers)
  const items = useTierDataStore((s) => s.items)
  const containers = useTierDataStore((s) => s.containers)
  const startBlindChallenge = useBlindStore((s) => s.startBlindChallenge)

  const poolItemIds = containers['POOL'] || []
  const totalItemsCount = items.length
  const poolCount = poolItemIds.length

  const [mode, setMode] = useState<BlindChallengeMode>('standard')
  const [resetBoardFirst, setResetBoardFirst] = useState(true)

  // Default tier caps: Tier 1: 1, Tier 2: 2, Tier 3: 3, etc.
  const defaultTierCaps = useMemo(() => {
    const caps: Record<string, number> = {}
    tiers.forEach((t, idx) => {
      caps[t.id] = Math.max(1, idx + 1)
    })
    return caps
  }, [tiers])

  const [tierCaps, setTierCaps] = useState<Record<string, number>>(defaultTierCaps)

  const handleCapChange = (tierId: string, delta: number) => {
    setTierCaps((prev) => {
      const current = prev[tierId] ?? 1
      const next = Math.max(1, Math.min(20, current + delta))
      return { ...prev, [tierId]: next }
    })
  }

  const handleStart = () => {
    startBlindChallenge({
      mode,
      tierCaps: mode === 'hardcore' ? tierCaps : {},
      resetBoardFirst: resetBoardFirst || poolCount === 0,
    })
  }

  const effectiveCount = resetBoardFirst || poolCount === 0 ? totalItemsCount : poolCount

  return (
    <Dialog open={isBlindSetupOpen} onOpenChange={setBlindSetupOpen}>
      <DialogContent className="sm:max-w-lg bg-card border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20">
              <HugeiconsIcon icon={DicesIcon} size={22} />
            </div>
            <div>
              <DialogTitle
                className="text-lg font-black tracking-tight text-foreground flex items-center gap-2"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                <span>Blind Ranking Challenge</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-500 font-bold border border-rose-500/20">
                  GAME MODE
                </span>
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Mystery items are drawn one-by-one. Lock your rank without knowing what is
                coming next!
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Rules Brief */}
          <div className="p-3 rounded-xl bg-secondary/70 border border-border/80 text-xs space-y-1.5 font-sans">
            <div className="flex items-center gap-1.5 font-bold text-foreground">
              <HugeiconsIcon icon={SparklesIcon} size={14} className="text-rose-500" />
              <span>How It Works:</span>
            </div>
            <ul className="space-y-1 text-muted-foreground text-[11px] list-disc list-inside">
              <li>Items are drawn randomly from a hidden deck.</li>
              <li>
                Once placed into a tier, items are <strong>permanently locked</strong> in
                stone.
              </li>
              <li>You must assign the current card before the next card is revealed.</li>
            </ul>
          </div>

          {/* Mode Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold font-mono uppercase tracking-wider text-muted-foreground">
              Select Challenge Difficulty
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Standard Mode Card */}
              <button
                type="button"
                onClick={() => setMode('standard')}
                className={`p-3 rounded-xl border text-left transition-all relative ${
                  mode === 'standard'
                    ? 'bg-rose-500/10 border-rose-500 ring-2 ring-rose-500/30'
                    : 'bg-secondary/50 hover:bg-secondary border-border/80'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-foreground">
                    <HugeiconsIcon
                      icon={Layers01Icon}
                      size={15}
                      className="text-rose-500"
                    />
                    <span>Standard Mode</span>
                  </div>
                  {mode === 'standard' && (
                    <Badge className="bg-rose-600 text-white text-[9px] px-1.5 py-0 font-bold font-mono">
                      Selected
                    </Badge>
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Unlimited slots per tier. Place items wherever your intuition tells you.
                </p>
              </button>

              {/* Hardcore Mode Card */}
              <button
                type="button"
                onClick={() => setMode('hardcore')}
                className={`p-3 rounded-xl border text-left transition-all relative ${
                  mode === 'hardcore'
                    ? 'bg-amber-500/10 border-amber-500 ring-2 ring-amber-500/30'
                    : 'bg-secondary/50 hover:bg-secondary border-border/80'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-foreground">
                    <HugeiconsIcon
                      icon={FlameIcon}
                      size={15}
                      className="text-amber-500"
                    />
                    <span>Hardcore Limits</span>
                  </div>
                  {mode === 'hardcore' && (
                    <Badge className="bg-amber-600 text-white text-[9px] px-1.5 py-0 font-bold font-mono">
                      Selected
                    </Badge>
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Strict slot capacity per tier (e.g. Max 1 in S-Tier). Tiers lock once
                  filled!
                </p>
              </button>
            </div>
          </div>

          {/* Hardcore Slot Capacity Customizer */}
          {mode === 'hardcore' && (
            <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-2.5 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-foreground flex items-center gap-1.5">
                  <HugeiconsIcon icon={FlameIcon} size={13} className="text-amber-500" />
                  <span>Tier Capacity Limits:</span>
                </span>
                <span className="text-[10px] font-mono text-muted-foreground">
                  Adjust maximum items allowed per tier
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {tiers.map((t) => {
                  const cap = tierCaps[t.id] ?? 1
                  return (
                    <div
                      key={t.id}
                      className="p-2 rounded-lg bg-card border border-border/80 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-1.5 min-w-0 pr-1">
                        <span
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: t.color }}
                        />
                        <span className="text-xs font-bold truncate text-foreground">
                          {t.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleCapChange(t.id, -1)}
                          disabled={cap <= 1}
                          className="w-5 h-5 rounded flex items-center justify-center bg-secondary hover:bg-accent text-foreground disabled:opacity-30 active:scale-90 transition-all text-xs"
                        >
                          <HugeiconsIcon icon={MinusSignIcon} size={10} />
                        </button>
                        <span className="w-5 text-center font-mono font-bold text-xs text-foreground">
                          {cap}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCapChange(t.id, 1)}
                          disabled={cap >= 20}
                          className="w-5 h-5 rounded flex items-center justify-center bg-secondary hover:bg-accent text-foreground disabled:opacity-30 active:scale-90 transition-all text-xs"
                        >
                          <HugeiconsIcon icon={PlusSignIcon} size={10} />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Board Setup Option */}
          <div className="p-3 rounded-xl bg-secondary/50 border border-border/80 space-y-2">
            <label className="text-xs font-bold text-foreground block">
              Deck Starting Configuration
            </label>
            <div className="space-y-1.5 text-xs">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="radio"
                  name="blind-board-option"
                  checked={resetBoardFirst || poolCount === 0}
                  onChange={() => setResetBoardFirst(true)}
                  className="rounded-full text-rose-600 focus:ring-rose-500"
                />
                <span className="font-medium text-foreground">
                  Reset board and shuffle all <strong>{totalItemsCount}</strong> items
                  into draw deck
                </span>
              </label>

              {poolCount > 0 && poolCount < totalItemsCount && (
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="radio"
                    name="blind-board-option"
                    checked={!resetBoardFirst}
                    onChange={() => setResetBoardFirst(false)}
                    className="rounded-full text-rose-600 focus:ring-rose-500"
                  />
                  <span className="font-medium text-foreground">
                    Keep current board and only rank remaining{' '}
                    <strong>{poolCount}</strong> vault items
                  </span>
                </label>
              )}
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setBlindSetupOpen(false)}
            className="text-xs font-semibold"
          >
            Cancel
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={handleStart}
            disabled={effectiveCount === 0}
            className="bg-rose-600 hover:bg-rose-500 text-white font-bold gap-2 text-xs shadow-md active:scale-95 transition-all px-4"
          >
            <HugeiconsIcon icon={PlayIcon} size={15} />
            <span>Start Challenge ({effectiveCount} Items)</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
