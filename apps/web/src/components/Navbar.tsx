import { useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Undo02Icon,
  Redo02Icon,
  Download01Icon,
  EyeIcon,
  EyeOffIcon,
  DicesIcon,
} from '@hugeicons/core-free-icons'
import { useUiStore } from '../store/useUiStore'
import { useMetadataStore } from '../store/useMetadataStore'
import { useTierDataStore, performUndo, performRedo } from '../store/useTierDataStore'
import { useHistoryStore } from '../store/useHistoryStore'
import { useBlindStore } from '../store/useBlindStore'
import { TEMPLATES } from '../lib/constants'
import { Link } from '@tanstack/react-router'
import { SimpleTooltip } from './ui/tooltip'
import { Button } from './ui/button'
import ConfirmModal from './ConfirmModal'
import { useTemplatesStore } from '../store/useTemplatesStore'

export default function Navbar() {
  const selectedTemplateId = useMetadataStore((s) => s.selectedTemplateId)
  const previewMode = useUiStore((s) => s.previewMode)
  const setPreviewMode = useUiStore((s) => s.setPreviewMode)
  const setTemplateOpen = useUiStore((s) => s.setTemplateOpen)
  const setExportOpen = useUiStore((s) => s.setExportOpen)

  const isBlindActive = useBlindStore((s) => s.isActive)
  const lockedItemIds = useBlindStore((s) => s.lockedItemIds)
  const totalItems = useBlindStore((s) => s.totalItems)
  const stopBlindChallenge = useBlindStore((s) => s.stopBlindChallenge)

  const [isNavbarExitConfirmOpen, setIsNavbarExitConfirmOpen] = useState(false)

  const canUndo = useHistoryStore((s) => s.canUndo())
  const canRedo = useHistoryStore((s) => s.canRedo())

  const tiers = useTierDataStore((s) => s.tiers)
  const containers = useTierDataStore((s) => s.containers)

  const templates = useTemplatesStore((s) => s.templates)
  const currentTemplate =
    templates.find((t) => t.id === selectedTemplateId) ||
    TEMPLATES.find((t) => t.id === selectedTemplateId) ||
    templates[0] ||
    TEMPLATES[0]

  const togglePreview = () => {
    setPreviewMode(!previewMode)
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/90 backdrop-blur-xl transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-3">
        {/* Left: Brand Identity & Template Switcher */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <SimpleTooltip content="Back to Landing Page" side="bottom">
            <Link
              to="/"
              className="flex items-center gap-2 group cursor-pointer p-1 rounded-xl hover:bg-secondary/80 transition-all text-left"
            >
              <div className="w-8 h-8 rounded-lg overflow-hidden border border-border bg-zinc-950 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <img
                  src="/logo.png"
                  alt="Tier Studio Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="hidden xs:block">
                <div className="flex items-center gap-1.5 leading-none">
                  <span
                    className="font-extrabold text-sm tracking-tight text-foreground group-hover:text-rose-500 transition-colors"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    TIER STUDIO
                  </span>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                    LIVE
                  </span>
                </div>
              </div>
            </Link>
          </SimpleTooltip>

          <div className="h-4 w-px bg-border hidden sm:block" />

          {/* Template Switcher Trigger (Disabled during Blind Challenge) */}
          <SimpleTooltip
            content={
              isBlindActive
                ? 'Template switching disabled during Blind Challenge'
                : 'Switch curated tier list preset'
            }
            side="bottom"
          >
            <button
              type="button"
              disabled={isBlindActive}
              onClick={() => setTemplateOpen(true)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-secondary text-secondary-foreground text-xs font-medium border border-border/60 transition-all ${
                isBlindActive
                  ? 'opacity-40 cursor-not-allowed'
                  : 'hover:bg-accent active:scale-95 cursor-pointer'
              }`}
            >
              <span className="text-sm leading-none">{currentTemplate.icon}</span>
              <span className="max-w-[100px] sm:max-w-[140px] truncate font-semibold">
                {currentTemplate.name}
              </span>
              <span className="text-[10px] text-muted-foreground font-mono">▼</span>
            </button>
          </SimpleTooltip>
        </div>

        {/* Center: Live Tier Distribution Mini-Bar OR Active Challenge HUD */}
        {isBlindActive ? (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-500 animate-in fade-in duration-200">
            <HugeiconsIcon
              icon={DicesIcon}
              size={14}
              className="text-rose-500 animate-spin"
              style={{ animationDuration: '6s' }}
            />
            <span className="text-xs font-mono font-bold">
              BLIND CHALLENGE ({lockedItemIds.length}/{totalItems})
            </span>
            <button
              type="button"
              onClick={() => setIsNavbarExitConfirmOpen(true)}
              className="text-[11px] font-bold px-2 py-0.5 rounded bg-rose-500/20 hover:bg-rose-500 hover:text-white transition-colors cursor-pointer"
            >
              Exit
            </button>
          </div>
        ) : (
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/80 border border-border/60">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground mr-1">
              Spread
            </span>
            <div className="flex items-center gap-1">
              {tiers.map((t) => {
                const count = (containers[t.id] || []).length
                return (
                  <SimpleTooltip
                    key={t.id}
                    content={`Tier ${t.title}: ${count} ${count === 1 ? 'item' : 'items'}`}
                    side="bottom"
                  >
                    <div
                      className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-mono font-bold transition-transform hover:scale-105"
                      style={{
                        backgroundColor: `${t.color}20`,
                        color: t.color,
                        border: `1px solid ${t.color}40`,
                      }}
                    >
                      <span className="text-[10px]">{t.title.slice(0, 1)}</span>
                      <span className="text-[10px] opacity-80">{count}</span>
                    </div>
                  </SimpleTooltip>
                )
              })}
            </div>
          </div>
        )}

        {/* Right: Tactile Studio Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Undo / Redo Segment */}
          <div className="flex items-center bg-secondary border border-border/70 rounded-xl p-0.5">
            <SimpleTooltip
              content={
                isBlindActive ? 'Undo disabled during Blind Challenge' : 'Undo (⌘Z)'
              }
              side="bottom"
            >
              <button
                type="button"
                onClick={performUndo}
                disabled={!canUndo || isBlindActive}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-background disabled:opacity-20 disabled:hover:bg-transparent transition-all active:scale-95 disabled:cursor-not-allowed cursor-pointer"
              >
                <HugeiconsIcon icon={Undo02Icon} size={15} />
              </button>
            </SimpleTooltip>
            <SimpleTooltip
              content={
                isBlindActive ? 'Redo disabled during Blind Challenge' : 'Redo (⌘Y / ⇧⌘Z)'
              }
              side="bottom"
            >
              <button
                type="button"
                onClick={performRedo}
                disabled={!canRedo || isBlindActive}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-background disabled:opacity-20 disabled:hover:bg-transparent transition-all active:scale-95 disabled:cursor-not-allowed cursor-pointer"
              >
                <HugeiconsIcon icon={Redo02Icon} size={15} />
              </button>
            </SimpleTooltip>
          </div>

          {/* Presentation Mode Toggle */}
          <SimpleTooltip
            content={
              previewMode ? 'Exit Presentation (P or Esc)' : 'Presentation Mode (P)'
            }
            side="bottom"
          >
            <button
              type="button"
              onClick={togglePreview}
              className={`p-1.5 sm:px-3 sm:py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer ${
                previewMode
                  ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                  : 'bg-secondary hover:bg-accent text-foreground border-border/70'
              }`}
            >
              <HugeiconsIcon icon={previewMode ? EyeOffIcon : EyeIcon} size={15} />
              <span className="hidden sm:inline">
                {previewMode ? 'Exit View' : 'Present'}
              </span>
            </button>
          </SimpleTooltip>

          {/* Standout Export Button */}
          <Button
            size="sm"
            onClick={() => setExportOpen(true)}
            className="h-8 sm:h-9 px-3.5 gap-1.5 font-bold bg-foreground text-background hover:opacity-90 shadow-sm active:scale-95 transition-all text-xs rounded-xl cursor-pointer"
          >
            <HugeiconsIcon icon={Download01Icon} size={14} />
            <span>Export</span>
          </Button>
        </div>
      </div>

      {/* Navbar Exit Challenge Confirmation Modal */}
      <ConfirmModal
        open={isNavbarExitConfirmOpen}
        onOpenChange={setIsNavbarExitConfirmOpen}
        title="Exit Blind Challenge?"
        description="Are you sure you want to end the Blind Challenge? Your placed cards will remain locked on the board."
        confirmText="Exit Challenge"
        cancelText="Keep Playing"
        variant="warning"
        onConfirm={() => stopBlindChallenge(true)}
      />
    </header>
  )
}
