import { useEffect, useMemo, useState } from 'react'
import { toPng, toBlob } from 'html-to-image'
import confetti from 'canvas-confetti'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  SparklesIcon,
  Download01Icon,
  Copy01Icon,
  RotateLeft01Icon,
  Tick02Icon,
  Clock01Icon,
  Layers01Icon,
  FlameIcon,
  CheckmarkCircle02Icon,
} from '@hugeicons/core-free-icons'
import { useUiStore } from '../store/useUiStore'
import { useBlindStore } from '../store/useBlindStore'
import { useTierDataStore } from '../store/useTierDataStore'
import { useMetadataStore } from '../store/useMetadataStore'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

export default function BlindChallengeSummaryModal() {
  const isBlindSummaryOpen = useUiStore((s) => s.isBlindSummaryOpen)
  const setBlindSummaryOpen = useUiStore((s) => s.setBlindSummaryOpen)
  const theme = useUiStore((s) => s.theme)

  const mode = useBlindStore((s) => s.mode)
  const startedAt = useBlindStore((s) => s.startedAt)
  const completedAt = useBlindStore((s) => s.completedAt)
  const totalItems = useBlindStore((s) => s.totalItems)
  const restartBlindChallenge = useBlindStore((s) => s.restartBlindChallenge)
  const unlockBoard = useBlindStore((s) => s.unlockBoard)

  const tiers = useTierDataStore((s) => s.tiers)
  const containers = useTierDataStore((s) => s.containers)
  const title = useMetadataStore((s) => s.title)

  const [isExporting, setIsExporting] = useState(false)
  const [copied, setCopied] = useState(false)

  // Trigger celebration confetti on mount
  useEffect(() => {
    if (isBlindSummaryOpen) {
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#e11d48', '#ea580c', '#d97706', '#059669', '#0284c7', '#7c3aed'],
      })
    }
  }, [isBlindSummaryOpen])

  // Calculate duration
  const durationText = useMemo(() => {
    if (!startedAt || !completedAt) return '00:00'
    const totalSecs = Math.max(1, Math.floor((completedAt - startedAt) / 1000))
    const mins = Math.floor(totalSecs / 60)
    const secs = totalSecs % 60
    if (mins > 0) {
      return `${mins}m ${secs}s`
    }
    return `${secs}s`
  }, [startedAt, completedAt])

  // Download high-res PNG
  const handleDownloadPng = async () => {
    const node = document.getElementById('tier-list-canvas')
    if (!node) return

    try {
      setIsExporting(true)
      const dataUrl = await toPng(node, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: theme === 'dark' ? '#090a0f' : '#f8f9fc',
      })

      const sanitizedName = (title || 'blind-challenge')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')

      const link = document.createElement('a')
      link.download = `${sanitizedName}-blind-ranking.png`
      link.href = dataUrl
      link.click()

      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
      })
      setIsExporting(false)
    } catch (err) {
      console.error('Failed to export PNG', err)
      setIsExporting(false)
    }
  }

  // Copy PNG to clipboard
  const handleCopyClipboard = async () => {
    const node = document.getElementById('tier-list-canvas')
    if (!node) return

    try {
      setIsExporting(true)
      const blob = await toBlob(node, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: theme === 'dark' ? '#090a0f' : '#f8f9fc',
      })

      if (blob && navigator.clipboard && window.ClipboardItem) {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob }),
        ])
        setCopied(true)
        setTimeout(() => setCopied(false), 3000)
      }
      setIsExporting(false)
    } catch (err) {
      console.error('Failed to copy image to clipboard', err)
      setIsExporting(false)
    }
  }

  return (
    <Dialog open={isBlindSummaryOpen} onOpenChange={setBlindSummaryOpen}>
      <DialogContent className="sm:max-w-lg bg-card border-border">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              <HugeiconsIcon icon={SparklesIcon} size={24} />
            </div>
            <div>
              <DialogTitle
                className="text-xl font-black text-foreground tracking-tight flex items-center gap-2"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                <span>Blind Challenge Completed!</span>
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                You successfully blind-ranked every mystery tile in the deck.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Milestone Metrics Card */}
          <div className="grid grid-cols-3 gap-2.5">
            {/* Placed Items */}
            <div className="p-3 rounded-xl bg-secondary/70 border border-border/80 text-center space-y-1">
              <div className="text-muted-foreground flex items-center justify-center">
                <HugeiconsIcon icon={Layers01Icon} size={16} />
              </div>
              <div className="text-lg font-black font-mono text-foreground">
                {totalItems}/{totalItems}
              </div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                Items Placed
              </span>
            </div>

            {/* Time Taken */}
            <div className="p-3 rounded-xl bg-secondary/70 border border-border/80 text-center space-y-1">
              <div className="text-rose-500 flex items-center justify-center">
                <HugeiconsIcon icon={Clock01Icon} size={16} />
              </div>
              <div className="text-lg font-black font-mono text-foreground">
                {durationText}
              </div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                Time Taken
              </span>
            </div>

            {/* Mode Tag */}
            <div className="p-3 rounded-xl bg-secondary/70 border border-border/80 text-center space-y-1">
              <div className="text-amber-500 flex items-center justify-center">
                <HugeiconsIcon icon={FlameIcon} size={16} />
              </div>
              <div className="text-xs font-black font-mono text-foreground uppercase pt-1">
                {mode === 'hardcore' ? 'Hardcore' : 'Standard'}
              </div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                Difficulty
              </span>
            </div>
          </div>

          {/* Tier Breakdown Summary Pills */}
          <div className="p-3 rounded-xl bg-secondary/40 border border-border/80 space-y-2">
            <span className="text-xs font-bold font-mono uppercase tracking-wider text-muted-foreground block">
              Tier Placements Breakdown:
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {tiers.map((t) => {
                const count = (containers[t.id] || []).length
                return (
                  <div
                    key={t.id}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-bold"
                    style={{
                      backgroundColor: `${t.color}20`,
                      color: t.color,
                      border: `1px solid ${t.color}40`,
                    }}
                  >
                    <span>{t.title}</span>
                    <span className="opacity-80">({count})</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Export Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            <Button
              type="button"
              onClick={handleDownloadPng}
              disabled={isExporting}
              className="w-full font-bold gap-2 bg-foreground text-background hover:opacity-90 h-9 text-xs"
            >
              <HugeiconsIcon icon={Download01Icon} size={15} />
              <span>{isExporting ? 'Rendering...' : 'Download Graphic (PNG)'}</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleCopyClipboard}
              disabled={isExporting}
              className="w-full font-bold gap-2 bg-secondary border-border h-9 text-xs"
            >
              {copied ? (
                <>
                  <HugeiconsIcon icon={Tick02Icon} size={15} className="text-emerald-500" />
                  <span className="text-emerald-500">Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <HugeiconsIcon icon={Copy01Icon} size={15} />
                  <span>Copy Graphic</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="flex items-center justify-between pt-3 border-t border-border gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={restartBlindChallenge}
            className="text-xs font-bold gap-1.5 bg-secondary border-border active:scale-95"
          >
            <HugeiconsIcon icon={RotateLeft01Icon} size={14} />
            <span>Play Again (Reshuffle)</span>
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={unlockBoard}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold gap-1.5 text-xs active:scale-95 shadow-sm"
          >
            <HugeiconsIcon icon={CheckmarkCircle02Icon} size={15} />
            <span>Keep & Unlock Board</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
