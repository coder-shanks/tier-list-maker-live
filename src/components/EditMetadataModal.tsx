import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { HugeiconsIcon } from '@hugeicons/react'
import { Edit02Icon } from '@hugeicons/core-free-icons'
import { useUiStore } from '../store/useUiStore'
import { useMetadataStore } from '../store/useMetadataStore'

function EditMetadataForm({ onClose }: { onClose: () => void }) {
  const title = useMetadataStore((s) => s.title)
  const subtitle = useMetadataStore((s) => s.subtitle)
  const author = useMetadataStore((s) => s.author)
  const updateMetadata = useMetadataStore((s) => s.updateMetadata)

  const [localTitle, setLocalTitle] = useState(title)
  const [localSubtitle, setLocalSubtitle] = useState(subtitle)
  const [localAuthor, setLocalAuthor] = useState(author)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    updateMetadata({
      title: localTitle.trim() || 'Live Tier List',
      subtitle: localSubtitle.trim() || 'Ranked live',
      author: localAuthor.trim() || 'Creator',
    })
    onClose()
  }

  return (
    <form onSubmit={handleSave} className="space-y-3.5 py-1">
      <div className="space-y-1">
        <label className="text-xs font-semibold text-foreground">
          Tier List Title *
        </label>
        <Input
          type="text"
          required
          value={localTitle}
          onChange={(e) => setLocalTitle(e.target.value)}
          placeholder="e.g. Best Video Games of All Time"
          className="h-9 text-xs font-semibold bg-secondary border-border"
          autoFocus
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-semibold text-foreground">
          Ranking Criteria / Subtitle
        </label>
        <Input
          type="text"
          value={localSubtitle}
          onChange={(e) => setLocalSubtitle(e.target.value)}
          placeholder="e.g. Ranked live on stream based on personal fun & replayability"
          className="h-9 text-xs bg-secondary border-border"
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-semibold text-foreground">
          Creator Watermark Name
        </label>
        <Input
          type="text"
          value={localAuthor}
          onChange={(e) => setLocalAuthor(e.target.value)}
          placeholder="e.g. @shubham.tarade or Streamer Name"
          className="h-9 text-xs bg-secondary border-border"
        />
      </div>

      <DialogFooter className="pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="h-8 text-xs"
        >
          Cancel
        </Button>
        <Button type="submit" className="h-8 text-xs font-bold bg-foreground text-background">
          Save Changes
        </Button>
      </DialogFooter>
    </form>
  )
}

export default function EditMetadataModal() {
  const isEditMetadataOpen = useUiStore((s) => s.isEditMetadataOpen)
  const setEditMetadataOpen = useUiStore((s) => s.setEditMetadataOpen)

  return (
    <Dialog open={isEditMetadataOpen} onOpenChange={setEditMetadataOpen}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-secondary text-foreground">
              <HugeiconsIcon icon={Edit02Icon} size={18} />
            </div>
            <div>
              <DialogTitle className="text-base font-bold" style={{ fontFamily: 'var(--font-display)' }}>
                Board Details & Author
              </DialogTitle>
              <DialogDescription className="text-xs">
                Customize the title, ranking criteria subtitle, and watermark name.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {isEditMetadataOpen && (
          <EditMetadataForm onClose={() => setEditMetadataOpen(false)} />
        )}
      </DialogContent>
    </Dialog>
  )
}
