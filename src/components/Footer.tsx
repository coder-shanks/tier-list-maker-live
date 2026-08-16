import { memo } from 'react'
import { useUiStore } from '../store/useUiStore'

export const Footer = memo(function Footer() {
  const previewMode = useUiStore((s) => s.previewMode)

  if (previewMode) {
    return null
  }

  return (
    <footer className="py-5 border-t border-border/80 text-center text-xs text-muted-foreground space-y-1.5 transition-colors">
      <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] font-mono">
        <span className="text-foreground font-semibold">Shortcuts:</span>
        <span className="inline-flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 rounded bg-secondary text-foreground border border-border">⌘Z</kbd> Undo
        </span>
        <span>•</span>
        <span className="inline-flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 rounded bg-secondary text-foreground border border-border">⌘Y</kbd> Redo
        </span>
        <span>•</span>
        <span className="inline-flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 rounded bg-secondary text-foreground border border-border">P</kbd> Present
        </span>
        <span>•</span>
        <span className="inline-flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 rounded bg-secondary text-foreground border border-border">N</kbd> New Card
        </span>
        <span>•</span>
        <span className="inline-flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 rounded bg-secondary text-foreground border border-border">R</kbd> Roulette
        </span>
        <span>•</span>
        <span className="inline-flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 rounded bg-secondary text-foreground border border-border">B</kbd> Blind Rank
        </span>
        <span>•</span>
        <span className="inline-flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 rounded bg-secondary text-foreground border border-border">⌘E</kbd> Export
        </span>
      </div>
    </footer>
  )
})

export default Footer

