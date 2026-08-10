import React, { useState, useRef } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  PlusSignIcon,
  Upload01Icon,
  Link01Icon,
  SparklesIcon,
  AddToListIcon,
} from '@hugeicons/core-free-icons'
import { useTierListStore } from '../store/useTierListStore'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

export default function AddItemModal() {
  const {
    isAddItemOpen,
    setAddItemOpen,
    addItem,
    bulkAddItems,
    tiers,
  } = useTierListStore()

  const [activeTab, setActiveTab] = useState<'single' | 'bulk'>('single')

  // Single Item form state
  const [title, setTitle] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [category, setCategory] = useState('Custom')
  const [subtitle, setSubtitle] = useState('')
  const [targetContainerId, setTargetContainerId] = useState('POOL')
  const [previewError, setPreviewError] = useState(false)

  // Bulk Add form state
  const [bulkText, setBulkText] = useState('')
  const [bulkCategory, setBulkCategory] = useState('Custom')

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Handle local image file upload (convert to Base64 data URL)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file.')
        return
      }
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setImageUrl(event.target.result as string)
          setPreviewError(false)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSingleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    addItem(
      {
        title: title.trim(),
        imageUrl: imageUrl.trim() || undefined,
        category: category.trim() || 'Custom',
        subtitle: subtitle.trim() || undefined,
      },
      targetContainerId,
    )

    // Reset form
    setTitle('')
    setImageUrl('')
    setSubtitle('')
    setAddItemOpen(false)
  }

  const handleBulkSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const lines = bulkText
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)

    if (lines.length === 0) return

    const itemsToCreate = lines.map((name) => ({
      title: name,
      category: bulkCategory.trim() || 'Custom',
    }))

    bulkAddItems(itemsToCreate)
    setBulkText('')
    setAddItemOpen(false)
  }

  return (
    <Dialog open={isAddItemOpen} onOpenChange={setAddItemOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <HugeiconsIcon icon={PlusSignIcon} size={18} />
            </div>
            <div>
              <DialogTitle className="text-base font-bold">Add Custom Item</DialogTitle>
              <DialogDescription className="text-xs">
                Add an image, character, or game to your tier list.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Tab Buttons */}
        <Tabs
          value={activeTab}
          onValueChange={(val) => setActiveTab(val as 'single' | 'bulk')}
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="single" className="gap-1.5 text-xs font-bold">
              <HugeiconsIcon icon={SparklesIcon} size={14} />
              Single Item
            </TabsTrigger>
            <TabsTrigger value="bulk" className="gap-1.5 text-xs font-bold">
              <HugeiconsIcon icon={AddToListIcon} size={14} />
              Bulk Add
            </TabsTrigger>
          </TabsList>

          {/* Single Item Form */}
          <TabsContent value="single" className="pt-2">
            <form onSubmit={handleSingleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
                <div className="sm:col-span-2 space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground">
                      Item Name / Title *
                    </label>
                    <Input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. God of War, LeBron James, Pizza"
                      className="h-9 text-xs"
                      autoFocus
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground">
                      Image (URL or Local File)
                    </label>
                    <div className="flex gap-1.5">
                      <div className="relative flex-1">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                          <HugeiconsIcon icon={Link01Icon} size={14} />
                        </span>
                        <Input
                          type="url"
                          value={imageUrl}
                          onChange={(e) => {
                            setImageUrl(e.target.value)
                            setPreviewError(false)
                          }}
                          placeholder="https://... or upload ->"
                          className="pl-8 h-8 text-xs"
                        />
                      </div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept="image/*"
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        className="gap-1.5 text-xs h-8"
                      >
                        <HugeiconsIcon icon={Upload01Icon} size={14} />
                        <span>Upload</span>
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-foreground">
                        Category / Tag
                      </label>
                      <Input
                        type="text"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        placeholder="e.g. Gaming"
                        className="h-8 text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-foreground">
                        Target Tier
                      </label>
                      <select
                        value={targetContainerId}
                        onChange={(e) => setTargetContainerId(e.target.value)}
                        className="w-full h-8 px-2 py-1 text-xs bg-transparent border border-input rounded-md text-foreground focus:outline-hidden focus:ring-1 focus:ring-ring"
                      >
                        <option value="POOL">Unassigned Pool</option>
                        {tiers.map((t) => (
                          <option key={t.id} value={t.id}>
                            Tier {t.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Live Card Preview */}
                <div className="flex flex-col items-center justify-center p-3 bg-muted/40 rounded-xl border border-border text-center">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground mb-2">
                    Card Preview
                  </span>
                  <div className="w-20 h-20 rounded-xl overflow-hidden shadow-md relative border border-border bg-muted flex items-center justify-center">
                    {imageUrl && !previewError ? (
                      <img
                        src={imageUrl}
                        alt="Preview"
                        onError={() => setPreviewError(true)}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-linear-to-tr from-indigo-600 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
                        {title.slice(0, 2).toUpperCase() || 'ITEM'}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-1 inset-x-1 text-center">
                      <p className="text-[9px] font-bold text-white truncate">
                        {title || 'Item Name'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter className="pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setAddItemOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  Add Item
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>

          {/* Bulk Form */}
          <TabsContent value="bulk" className="pt-2">
            <form onSubmit={handleBulkSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">
                  Item Names (one per line)
                </label>
                <textarea
                  rows={5}
                  value={bulkText}
                  onChange={(e) => setBulkText(e.target.value)}
                  placeholder="Minecraft&#10;Fortnite&#10;Apex Legends&#10;Valorant&#10;Overwatch 2"
                  className="w-full px-3 py-2 text-xs bg-muted/40 border border-input rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:border-indigo-500 font-mono leading-relaxed"
                  autoFocus
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">
                  Default Category
                </label>
                <Input
                  type="text"
                  value={bulkCategory}
                  onChange={(e) => setBulkCategory(e.target.value)}
                  placeholder="Custom"
                  className="h-8 text-xs"
                />
              </div>

              <DialogFooter className="pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setAddItemOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={!bulkText.trim()}>
                  Add All Items
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
