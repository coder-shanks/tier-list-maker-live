import React, { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Tick02Icon,
  Delete02Icon,
  RotateLeft01Icon,
  ArrowUp01Icon,
  ArrowDown01Icon,
} from '@hugeicons/core-free-icons'
import { COLOR_PRESETS } from '../lib/constants'
import type { Tier } from '../lib/types'
import { useTierDataStore } from '../store/useTierDataStore'

type TierSettingsPopoverProps = {
  tier: Tier
  isFirst: boolean
  isLast: boolean
  itemCount: number
  children: React.ReactElement
}

export default function TierSettingsPopover({
  tier,
  isFirst,
  isLast,
  itemCount,
  children,
}: TierSettingsPopoverProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState(tier.title)
  const [customHex, setCustomHex] = useState(tier.color)

  const updateTier = useTierDataStore((s) => s.updateTier)
  const deleteTier = useTierDataStore((s) => s.deleteTier)
  const moveTier = useTierDataStore((s) => s.moveTier)
  const clearTier = useTierDataStore((s) => s.clearTier)

  const handleSaveTitle = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim()) {
      updateTier(tier.id, { title: title.trim() })
    }
  }

  const handleSelectColor = (bg: string, text: string) => {
    updateTier(tier.id, { color: bg, textColor: text })
    setCustomHex(bg)
  }

  const handleCustomColor = (colorHex: string) => {
    setCustomHex(colorHex)
    const hex = colorHex.replace('#', '')
    const r = parseInt(hex.length === 3 ? hex[0] + hex[0] : hex.substring(0, 2), 16)
    const g = parseInt(hex.length === 3 ? hex[1] + hex[1] : hex.substring(2, 4), 16)
    const b = parseInt(hex.length === 3 ? hex[2] + hex[2] : hex.substring(4, 6), 16)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
    const textColor = luminance > 0.55 ? '#000000' : '#ffffff'
    updateTier(tier.id, { color: colorHex, textColor })
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger render={children} />
      <PopoverContent
        side="right"
        align="start"
        className="w-72 p-3.5 space-y-3.5 shadow-xl border-border bg-popover"
      >
        {/* Tier Title Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground flex items-center justify-between">
            <span>Tier Label</span>
            <span className="text-[10px] text-muted-foreground font-mono font-normal">
              {itemCount} {itemCount === 1 ? 'item' : 'items'}
            </span>
          </label>
          <div className="flex gap-1.5">
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. S, Masterpiece, God Tier"
              className="h-8 text-xs font-semibold"
              onBlur={handleSaveTitle}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveTitle(e)}
            />
            <Button
              size="xs"
              type="button"
              onClick={handleSaveTitle}
              variant="secondary"
              className="h-8 px-2"
            >
              <HugeiconsIcon icon={Tick02Icon} size={14} />
            </Button>
          </div>
        </div>

        {/* Color Palette Presets */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold text-foreground">
            <span>Grade Accent</span>
            <span className="text-[10px] font-mono text-muted-foreground">
              {tier.color}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-1.5">
            {COLOR_PRESETS.map((preset) => {
              const isSelected = tier.color.toLowerCase() === preset.bg.toLowerCase()
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectColor(preset.bg, preset.text)}
                  style={{ backgroundColor: preset.bg }}
                  title={preset.name}
                  className="h-6 rounded-md relative flex items-center justify-center transition-transform hover:scale-105 active:scale-95 shadow-2xs border border-black/10"
                >
                  {isSelected && (
                    <span style={{ color: preset.text }}>
                      <HugeiconsIcon icon={Tick02Icon} size={13} />
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Custom Color Input */}
          <div className="flex gap-1.5 items-center pt-1">
            <Input
              type="text"
              value={customHex}
              onChange={(e) => handleCustomColor(e.target.value)}
              placeholder="#e11d48"
              className="h-7 text-xs font-mono"
            />
            <input
              type="color"
              value={
                customHex.startsWith('#') && customHex.length >= 4 ? customHex : '#e11d48'
              }
              onChange={(e) => handleCustomColor(e.target.value)}
              className="w-7 h-7 rounded-md border-0 bg-transparent cursor-pointer p-0 shrink-0"
              title="Pick custom color"
            />
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-2 border-t border-border flex flex-col gap-1">
          <div className="grid grid-cols-2 gap-1.5">
            <Button
              type="button"
              variant="outline"
              size="xs"
              disabled={isFirst}
              onClick={() => moveTier(tier.id, 'up')}
              className="justify-start gap-1 text-[11px] h-7"
            >
              <HugeiconsIcon icon={ArrowUp01Icon} size={13} />
              Move Up
            </Button>
            <Button
              type="button"
              variant="outline"
              size="xs"
              disabled={isLast}
              onClick={() => moveTier(tier.id, 'down')}
              className="justify-start gap-1 text-[11px] h-7"
            >
              <HugeiconsIcon icon={ArrowDown01Icon} size={13} />
              Move Down
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-1.5 mt-0.5">
            <Button
              type="button"
              variant="ghost"
              size="xs"
              disabled={itemCount === 0}
              onClick={() => clearTier(tier.id)}
              className="justify-start gap-1 text-[11px] h-7 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10"
            >
              <HugeiconsIcon icon={RotateLeft01Icon} size={13} />
              Clear Items
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="xs"
              onClick={() => {
                deleteTier(tier.id)
                setIsOpen(false)
              }}
              className="justify-start gap-1 text-[11px] h-7 text-destructive hover:bg-destructive/10"
            >
              <HugeiconsIcon icon={Delete02Icon} size={13} />
              Delete Tier
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
