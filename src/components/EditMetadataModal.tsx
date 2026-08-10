import { useState, useEffect } from 'react'
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
import { useTierListStore } from '../store/useTierListStore'

export default function EditMetadataModal() {
  const {
    isEditMetadataOpen,
    setEditMetadataOpen,
    title,
    subtitle,
    author,
    updateMetadata,
  } = useTierListStore()

  const [localTitle, setLocalTitle] = useState(title)
  const [localSubtitle, setLocalSubtitle] = useState(subtitle)
  const [localAuthor, setLocalAuthor] = useState(author)

  useEffect(() => {
    if (isEditMetadataOpen) {
      setLocalTitle(title)
      setLocalSubtitle(subtitle)
      setLocalAuthor(author)
    }
  }, [isEditMetadataOpen, title, subtitle, author])

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    updateMetadata({
      title: localTitle.trim() || 'Live Tier List',
      subtitle: localSubtitle.trim() || 'Ranked live',
      author: localAuthor.trim() || 'Creator',
    })
    setEditMetadataOpen(false)
  }

  return (
    <Dialog open={isEditMetadataOpen} onOpenChange={setEditMetadataOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <HugeiconsIcon icon={Edit02Icon} size={18} />
            </div>
            <div>
              <DialogTitle className="text-base sm:text-lg font-bold">
                Edit Tier List Info
              </DialogTitle>
              <DialogDescription className="text-xs">
                Update the title, subtitle/criteria, and creator watermark.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSave} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Tier List Title *
            </label>
            <Input
              type="text"
              required
              value={localTitle}
              onChange={(e) => setLocalTitle(e.target.value)}
              placeholder="e.g. Best Video Games of All Time"
              className="h-10 text-sm font-medium"
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Subtitle / Ranking Criteria
            </label>
            <Input
              type="text"
              value={localSubtitle}
              onChange={(e) => setLocalSubtitle(e.target.value)}
              placeholder="e.g. Ranked live on stream based on personal fun & replayability"
              className="h-10 text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Creator Watermark / Author Name
            </label>
            <Input
              type="text"
              value={localAuthor}
              onChange={(e) => setLocalAuthor(e.target.value)}
              placeholder="e.g. @shubham.tarade or Streamer Name"
              className="h-10 text-sm"
            />
          </div>

          <DialogFooter className="pt-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditMetadataOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
