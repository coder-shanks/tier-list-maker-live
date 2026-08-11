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
import { useTierListStore } from '../store/useTierListStore'
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
  const {
    isAddItemOpen,
    setAddItemOpen,
    addItem,
    bulkAddItems,
    tiers,
  } = useTierListStore()

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

  // Trigger search on submit or debounce
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

  // Pre-populate trending search recommendations when opening modal
  useEffect(() => {
    if (isAddItemOpen && searchResults.length === 0 && !hasSearched) {
      searchOpenSourceImages('Super Mario', 8).then((res) => {
        if (res.length > 0 && !hasSearched) {
          setSearchResults(res)
        }
      })
    }
  }, [isAddItemOpen, searchResults.length, hasSearched])

  // Select an image from search results
  const handleSelectSearchResult = (result: ImageSearchResult) => {
    setTitle(result.title)
    setImageUrl(result.thumbnailUrl)
    setCategory('Discovered')
    setSubtitle(result.description?.slice(0, 50) || '')
    setActiveTab('single')
    setPreviewError(false)
  }

  // 1-Click Quick Add from search results
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
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="p-4 sm:p-5 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <HugeiconsIcon icon={PlusSignIcon} size={18} />
            </div>
            <div>
              <DialogTitle className="text-base font-bold">Add Item to Tier List</DialogTitle>
              <DialogDescription className="text-xs">
                Search open-source web images, upload your own, or bulk import names.
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
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="search" className="gap-1.5 text-xs font-bold">
                <HugeiconsIcon icon={Globe02Icon} size={14} />
                <span>Web Image Search</span>
              </TabsTrigger>
              <TabsTrigger value="single" className="gap-1.5 text-xs font-bold">
                <HugeiconsIcon icon={SparklesIcon} size={14} />
                <span>Custom / Upload</span>
              </TabsTrigger>
              <TabsTrigger value="bulk" className="gap-1.5 text-xs font-bold">
                <HugeiconsIcon icon={AddToListIcon} size={14} />
                <span>Bulk Import</span>
              </TabsTrigger>
            </TabsList>

            {/* TAB 1: Open-Source Web Image Search */}
            <TabsContent value="search" className="pt-3 space-y-3">
              <form onSubmit={handlePerformSearch} className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <HugeiconsIcon icon={Search01Icon} size={15} />
                  </span>
                  <Input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search Wikipedia & Wikimedia (e.g. Witcher, Goku, Messi, Pizza)..."
                    className="pl-9 h-9 text-xs"
                    autoFocus
                  />
                </div>
                <Button type="submit" size="sm" disabled={isSearching || !searchQuery.trim()} className="gap-1.5 font-bold">
                  {isSearching ? (
                    <span className="animate-spin text-xs">⏳</span>
                  ) : (
                    <HugeiconsIcon icon={Search01Icon} size={14} />
                  )}
                  <span>Search</span>
                </Button>
              </form>

              {/* Target Tier Selection for Quick Add */}
              <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
                <span>Quick Add Destination:</span>
                <select
                  value={targetContainerId}
                  onChange={(e) => setTargetContainerId(e.target.value)}
                  className="h-7 px-2 text-xs bg-muted/60 border border-input rounded-md text-foreground focus:outline-hidden"
                >
                  <option value="POOL">Unassigned Pool</option>
                  {tiers.map((t) => (
                    <option key={t.id} value={t.id}>
                      Tier {t.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Results Grid */}
              <div className="max-h-[300px] sm:max-h-[340px] overflow-y-auto pr-1">
                {isSearching ? (
                  <div className="py-12 text-center text-xs text-muted-foreground space-y-2">
                    <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p>Searching open-source image database...</p>
                  </div>
                ) : searchResults.length === 0 ? (
                  <div className="py-12 text-center text-xs text-muted-foreground">
                    {hasSearched ? 'No images found for your search query. Try another keyword!' : 'Type a keyword above to search millions of open-source images.'}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pb-2">
                    {searchResults.map((res) => (
                      <div
                        key={res.id}
                        className="group relative rounded-xl overflow-hidden border border-border bg-muted/40 hover:border-indigo-500 transition-all flex flex-col justify-between"
                      >
                        <div className="aspect-square w-full relative bg-zinc-900 overflow-hidden">
                          <img
                            src={res.thumbnailUrl}
                            alt={res.title}
                            crossOrigin="anonymous"
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                          <div className="absolute bottom-1 inset-x-1">
                            <p className="text-[10px] font-bold text-white truncate drop-shadow-md">
                              {res.title}
                            </p>
                          </div>
                        </div>

                        <div className="p-1.5 flex gap-1 bg-background/80 border-t border-border">
                          <Button
                            size="xs"
                            variant="secondary"
                            onClick={() => handleSelectSearchResult(res)}
                            className="flex-1 h-6 text-[10px] px-1"
                            title="Edit details before adding"
                          >
                            Customize
                          </Button>
                          <Button
                            size="xs"
                            onClick={() => handleQuickAddSearchResult(res)}
                            className="flex-1 h-6 text-[10px] px-1 bg-indigo-600 hover:bg-indigo-500 font-bold"
                            title="Add directly to tier list"
                          >
                            + Quick Add
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* TAB 2: Single Custom Item Form */}
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
                          referrerPolicy="no-referrer"
                          crossOrigin="anonymous"
                          onError={() => setPreviewError(true)}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-linear-to-tr from-indigo-600 via-purple-600 to-pink-500 flex flex-col items-center justify-center text-white font-bold text-xs p-1">
                          <span className="text-sm">{title.slice(0, 3).toUpperCase() || 'NEW'}</span>
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

            {/* TAB 3: Bulk Import */}
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
        </div>
      </DialogContent>
    </Dialog>
  )
}
