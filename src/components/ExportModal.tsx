import React, { useState } from 'react'
import { toPng, toBlob } from 'html-to-image'
import confetti from 'canvas-confetti'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Download01Icon,
  Copy01Icon,
  Tick02Icon,
  FileCodeIcon,
  Upload01Icon,
  SparklesIcon,
  Image01Icon,
} from '@hugeicons/core-free-icons'
import { useTierListStore } from '../store/useTierListStore'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

export default function ExportModal() {
  const {
    isExportOpen,
    setExportOpen,
    theme,
    title,
    subtitle,
    author,
    tiers,
    items,
    containers,
    importConfig,
  } = useTierListStore()

  const [isExporting, setIsExporting] = useState(false)
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<'image' | 'json'>('image')
  const [jsonInput, setJsonInput] = useState('')
  const [jsonSuccess, setJsonSuccess] = useState(false)

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'],
    })
  }

  // Export high-res PNG image
  const handleDownloadPng = async () => {
    const node = document.getElementById('tier-list-canvas')
    if (!node) return

    try {
      setIsExporting(true)
      const dataUrl = await toPng(node, {
        cacheBust: true,
        pixelRatio: 2, // High resolution 2x
        backgroundColor: theme === 'dark' ? '#09090b' : '#ffffff',
      })

      const sanitizedName = (title || 'tier-list')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')

      const link = document.createElement('a')
      link.download = `${sanitizedName}-tier-list.png`
      link.href = dataUrl
      link.click()

      triggerConfetti()
      setIsExporting(false)
    } catch (err) {
      console.error('Failed to export PNG', err)
      alert('Failed to generate PNG image. Please try again.')
      setIsExporting(false)
    }
  }

  // Copy PNG directly to clipboard
  const handleCopyClipboard = async () => {
    const node = document.getElementById('tier-list-canvas')
    if (!node) return

    try {
      setIsExporting(true)
      const blob = await toBlob(node, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: theme === 'dark' ? '#09090b' : '#ffffff',
      })

      if (blob && navigator.clipboard && window.ClipboardItem) {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob }),
        ])
        setCopied(true)
        triggerConfetti()
        setTimeout(() => setCopied(false), 3000)
      } else {
        alert('Clipboard image copy not supported in this browser. Please download PNG instead.')
      }
      setIsExporting(false)
    } catch (err) {
      console.error('Failed to copy image to clipboard', err)
      alert('Could not copy image to clipboard.')
      setIsExporting(false)
    }
  }

  // Export JSON file
  const handleExportJson = () => {
    const data = {
      title,
      subtitle,
      author,
      tiers,
      items,
      containers,
      exportedAt: new Date().toISOString(),
    }
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(data, null, 2),
    )}`
    const downloadAnchor = document.createElement('a')
    downloadAnchor.setAttribute('href', jsonString)
    downloadAnchor.setAttribute(
      'download',
      `${(title || 'tier-list').toLowerCase().replace(/\s+/g, '-')}.json`,
    )
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()
  }

  // Import JSON configuration
  const handleImportJson = (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const parsed = JSON.parse(jsonInput)
      if (parsed.tiers && parsed.items && parsed.containers) {
        importConfig(parsed)
        setJsonSuccess(true)
        triggerConfetti()
        setTimeout(() => {
          setJsonSuccess(false)
          setExportOpen(false)
        }, 1500)
      } else {
        alert('Invalid tier list JSON structure.')
      }
    } catch (err) {
      alert('Invalid JSON format.')
    }
  }

  return (
    <Dialog open={isExportOpen} onOpenChange={setExportOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <HugeiconsIcon icon={Image01Icon} size={18} />
            </div>
            <div>
              <DialogTitle className="text-base font-bold">Export & Share</DialogTitle>
              <DialogDescription className="text-xs">
                Save your tier list as a crisp graphic or backup data.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Tab switcher */}
        <Tabs
          value={activeTab}
          onValueChange={(val) => setActiveTab(val as 'image' | 'json')}
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="image" className="gap-1.5 text-xs font-bold">
              <HugeiconsIcon icon={Image01Icon} size={14} />
              Graphic (PNG)
            </TabsTrigger>
            <TabsTrigger value="json" className="gap-1.5 text-xs font-bold">
              <HugeiconsIcon icon={FileCodeIcon} size={14} />
              JSON Backup
            </TabsTrigger>
          </TabsList>

          <TabsContent value="image" className="space-y-4 pt-3">
            <div className="p-4 rounded-xl bg-muted/60 border border-border text-center space-y-2">
              <div className="w-10 h-10 mx-auto rounded-full bg-linear-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                <HugeiconsIcon icon={SparklesIcon} size={20} />
              </div>
              <h4 className="text-sm font-bold text-foreground">
                High-Resolution Graphic
              </h4>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                Generates a crystal-clear 2x PNG rendering of your ranked board complete with custom titles and tiers.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <Button
                type="button"
                onClick={handleDownloadPng}
                disabled={isExporting}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold gap-2"
              >
                <HugeiconsIcon icon={Download01Icon} size={15} />
                <span>{isExporting ? 'Rendering...' : 'Download PNG'}</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={handleCopyClipboard}
                disabled={isExporting}
                className="w-full font-bold gap-2"
              >
                {copied ? (
                  <>
                    <HugeiconsIcon icon={Tick02Icon} size={15} className="text-emerald-500" />
                    <span className="text-emerald-500">Copied!</span>
                  </>
                ) : (
                  <>
                    <HugeiconsIcon icon={Copy01Icon} size={15} />
                    <span>Copy Image</span>
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="json" className="space-y-4 pt-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground">
                Save Tier List Configuration
              </span>
              <Button
                variant="outline"
                size="xs"
                onClick={handleExportJson}
                className="gap-1.5 text-xs font-semibold"
              >
                <HugeiconsIcon icon={Download01Icon} size={14} />
                <span>Download .json</span>
              </Button>
            </div>

            <form onSubmit={handleImportJson} className="space-y-2 pt-2 border-t border-border">
              <label className="block text-xs font-semibold text-foreground">
                Import Tier List from JSON:
              </label>
              <textarea
                rows={4}
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder="Paste exported tier list JSON here..."
                className="w-full px-3 py-2 text-xs bg-muted/40 border border-input rounded-xl text-foreground font-mono placeholder:text-muted-foreground focus:outline-hidden focus:border-indigo-500"
              />
              <Button
                type="submit"
                disabled={!jsonInput.trim() || jsonSuccess}
                className="w-full gap-1.5"
              >
                {jsonSuccess ? (
                  <>
                    <HugeiconsIcon icon={Tick02Icon} size={15} className="text-emerald-400" />
                    <span>Imported Successfully!</span>
                  </>
                ) : (
                  <>
                    <HugeiconsIcon icon={Upload01Icon} size={15} />
                    <span>Import Configuration</span>
                  </>
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
