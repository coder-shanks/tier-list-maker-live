import React, { useState, useRef, useEffect } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  PlusSignIcon,
  Upload01Icon,
  Link01Icon,
  SparklesIcon,
  AddToListIcon,
  Search01Icon,
  Globe02Icon,
} from '@hugeicons/core-free-icons'
import { useUiStore } from '../store/useUiStore'
import { useTierDataStore } from '../store/useTierDataStore'
import { searchOpenSourceImages, type ImageSearchResult } from '../lib/imageService'
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
  const isAddItemOpen = useUiStore((s) => s.isAddItemOpen)
  const setAddItemOpen = useUiStore((s) => s.setAddItemOpen)

  const tiers = useTierDataStore((s) => s.tiers)
  const addItem = useTierDataStore((s) => s.addItem)
  const bulkAddItems = useTierDataStore((s) => s.bulkAddItems)

  const [activeTab, setActiveTab] = useState<'search' | 'single' | 'bulk'>('search')

  // Search tab state
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<ImageSearchResult[]>([])
  const [hasSearched, setHasSearched] = useState(false)

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

  // Trigger search
  const handlePerformSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!searchQuery.trim()) return

    setIsSearching(true)
    setHasSearched(true)
    try {
      const results = await searchOpenSourceImages(searchQuery.trim(), 12)
      setSearchResults(results)
    } catch (err) {
      console.error('Search failed:', err)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  // Pre-populate recommendations on open
  useEffect(() => {
    if (isAddItemOpen && searchResults.length === 0 && !hasSearched) {
      searchOpenSourceImages('Gaming', 8).then((res) => {
        if (res.length > 0 && !hasSearched) {
          setSearchResults(res)
        }
      })
    }
  }, [isAddItemOpen, searchResults.length, hasSearched])

  const handleSelectSearchResult = (result: ImageSearchResult) => {
    setTitle(result.title)
    setImageUrl(result.thumbnailUrl)
    setCategory('Discovered')
    setSubtitle(result.description?.slice(0, 50) || '')
    setActiveTab('single')
    setPreviewError(false)
  }

  const handleQuickAddSearchResult = (result: ImageSearchResult) => {
    addItem(
      {
        title: result.title,
        imageUrl: result.thumbnailUrl,
        category: 'Discovered',
        subtitle: result.description?.slice(0, 50) || undefined,
      },
      targetContainerId,
    )
    setAddItemOpen(false)
  }

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
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col p-0 overflow-hidden bg-card border-border">
        <DialogHeader className="p-4 sm:p-5 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-secondary text-foreground">
              <HugeiconsIcon icon={PlusSignIcon} size={18} />
            </div>
            <div>
              <DialogTitle className="text-base font-bold" style={{ fontFamily: 'var(--font-display)' }}>
                Add Item to Tier List
              </DialogTitle>
              <DialogDescription className="text-xs">
                Search open-source web photos, upload local images, or bulk import item names.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Tab Selection */}
        <div className="p-4 sm:p-5 pb-0">
          <Tabs
            value={activeTab}
            onValueChange={(val) => setActiveTab(val as 'search' | 'single' | 'bulk')}
            className="w-full"
          >
            <TabsList className="grid grid-cols-3 w-full bg-secondary">
              <TabsTrigger value="search" className="gap-1.5 text-xs font-bold font-mono">
                <HugeiconsIcon icon={Globe02Icon} size={13} />
                <span>Web Search</span>
              </TabsTrigger>
              <TabsTrigger value="single" className="gap-1.5 text-xs font-bold font-mono">
                <HugeiconsIcon icon={SparklesIcon} size={13} />
                <span>Custom Card</span>
              </TabsTrigger>
              <TabsTrigger value="bulk" className="gap-1.5 text-xs font-bold font-mono">
                <HugeiconsIcon icon={AddToListIcon} size={13} />
                <span>Bulk Import</span>
              </TabsTrigger>
            </TabsList>

            {/* TAB 1: Search */}
            <TabsContent value="search" className="pt-3 space-y-3">
              <form onSubmit={handlePerformSearch} className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <HugeiconsIcon icon={Search01Icon} size={14} />
                  </span>
                  <Input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search Wikipedia & Wikimedia (e.g. Witcher, Messi, Godfather)..."
                    className="pl-9 h-8 text-xs bg-secondary border-border"
                    autoFocus
                  />
                </div>
                <Button type="submit" size="sm" disabled={isSearching || !searchQuery.trim()} className="gap-1.5 font-bold h-8 text-xs bg-foreground text-background">
                  {isSearching ? (
                    <span className="animate-spin text-xs">⏳</span>
                  ) : (
                    <HugeiconsIcon icon={Search01Icon} size={13} />
                  )}
                  <span>Search</span>
                </Button>
              </form>

              {/* Target Container Select */}
              <div className="flex items-center justify-between text-xs text-muted-foreground px-1 font-mono">
                <span>Placement Target:</span>
                <select
                  value={targetContainerId}
                  onChange={(e) => setTargetContainerId(e.target.value)}
                  className="h-7 px-2 text-xs bg-secondary border border-border rounded text-foreground focus:outline-hidden"
                >
                  <option value="POOL">Vault (Unassigned)</option>
                  {tiers.map((t) => (
                    <option key={t.id} value={t.id}>
                      Tier {t.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Results Grid */}
              <div className="max-h-[280px] sm:max-h-[320px] overflow-y-auto pr-1">
                {isSearching ? (
                  <div className="py-12 text-center text-xs text-muted-foreground space-y-2 font-mono">
                    <div className="w-5 h-5 border-2 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p>Searching database...</p>
                  </div>
                ) : searchResults.length === 0 ? (
                  <div className="py-12 text-center text-xs text-muted-foreground font-mono">
                    {hasSearched ? 'No images found. Try another keyword!' : 'Search open-source web photos above.'}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pb-2">
                    {searchResults.map((res) => (
                      <div
                        key={res.id}
                        className="group relative rounded-lg overflow-hidden border border-border bg-secondary flex flex-col justify-between"
                      >
                        <div className="aspect-square w-full relative bg-zinc-950 overflow-hidden">
                          <img
                            src={res.thumbnailUrl}
                            alt={res.title}
                            crossOrigin="anonymous"
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                          <div className="absolute bottom-1 inset-x-1">
                            <p className="text-[10px] font-bold text-white truncate drop-shadow-sm">
                              {res.title}
                            </p>
                          </div>
                        </div>

                        <div className="p-1.5 flex gap-1 bg-card border-t border-border">
                          <Button
                            size="xs"
                            variant="secondary"
                            onClick={() => handleSelectSearchResult(res)}
                            className="flex-1 h-6 text-[10px] px-1"
                          >
                            Edit
                          </Button>
                          <Button
                            size="xs"
                            onClick={() => handleQuickAddSearchResult(res)}
                            className="flex-1 h-6 text-[10px] px-1 bg-foreground text-background font-bold"
                          >
                            + Add
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* TAB 2: Custom Card */}
            <TabsContent value="single" className="pt-2">
              <form onSubmit={handleSingleSubmit} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 items-start">
                  <div className="sm:col-span-2 space-y-2.5">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-foreground">
                        Item Name *
                      </label>
                      <Input
                        type="text"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Elden Ring, Pulp Fiction, JavaScript"
                        className="h-8 text-xs bg-secondary border-border"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-foreground">
                        Photo (URL or File)
                      </label>
                      <div className="flex gap-1.5">
                        <div className="relative flex-1">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                            <HugeiconsIcon icon={Link01Icon} size={13} />
                          </span>
                          <Input
                            type="url"
                            value={imageUrl}
                            onChange={(e) => {
                              setImageUrl(e.target.value)
                              setPreviewError(false)
                            }}
                            placeholder="https://..."
                            className="pl-8 h-8 text-xs bg-secondary border-border"
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
                          className="gap-1.5 text-xs h-8 px-2.5"
                        >
                          <HugeiconsIcon icon={Upload01Icon} size={13} />
                          <span>Upload</span>
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-foreground">
                          Category Tag
                        </label>
                        <Input
                          type="text"
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          placeholder="Custom"
                          className="h-8 text-xs bg-secondary border-border"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-foreground">
                          Destination
                        </label>
                        <select
                          value={targetContainerId}
                          onChange={(e) => setTargetContainerId(e.target.value)}
                          className="w-full h-8 px-2 py-1 text-xs bg-secondary border border-border rounded text-foreground focus:outline-hidden"
                        >
                          <option value="POOL">Vault (Unassigned)</option>
                          {tiers.map((t) => (
                            <option key={t.id} value={t.id}>
                              Tier {t.title}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Card Preview */}
                  <div className="flex flex-col items-center justify-center p-3 bg-secondary/50 rounded-lg border border-border text-center">
                    <span className="text-[10px] font-mono uppercase font-bold text-muted-foreground mb-2">
                      Preview
                    </span>
                    <div className="w-20 h-20 rounded-xl overflow-hidden shadow-md relative border border-border bg-zinc-900 flex items-center justify-center">
                      {imageUrl && !previewError ? (
                        <img
                          src={imageUrl}
                          alt="Preview"
                          referrerPolicy="no-referrer"
                          crossOrigin="anonymous"
                          onError={() => setPreviewError(true)}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-zinc-900 flex flex-col items-center justify-center text-zinc-100 font-mono font-bold text-xs p-1">
                          <span className="text-sm">{title.slice(0, 3).toUpperCase() || 'NEW'}</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />
                      <div className="absolute bottom-1 inset-x-1 text-center">
                        <p className="text-[9px] font-bold text-white truncate">
                          {title || 'Card Name'}
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
                    className="h-8 text-xs"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="h-8 text-xs font-bold bg-foreground text-background">
                    Add Card
                  </Button>
                </DialogFooter>
              </form>
            </TabsContent>

            {/* TAB 3: Bulk Import */}
            <TabsContent value="bulk" className="pt-2">
              <form onSubmit={handleBulkSubmit} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">
                    Item Names (one per line)
                  </label>
                  <textarea
                    rows={5}
                    value={bulkText}
                    onChange={(e) => setBulkText(e.target.value)}
                    placeholder="Elden Ring&#10;Dark Souls&#10;Bloodborne&#10;Sekiro"
                    className="w-full px-3 py-2 text-xs bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:border-rose-500 font-mono leading-relaxed"
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
                    className="h-8 text-xs bg-secondary border-border"
                  />
                </div>

                <DialogFooter className="pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setAddItemOpen(false)}
                    className="h-8 text-xs"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={!bulkText.trim()} className="h-8 text-xs font-bold bg-foreground text-background">
                    Import All
                  </Button>
                </DialogFooter>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
