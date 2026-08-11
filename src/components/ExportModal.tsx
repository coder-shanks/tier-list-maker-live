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
      particleCount: 70,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#e11d48', '#ea580c', '#d97706', '#059669', '#0284c7', '#7c3aed'],
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
        backgroundColor: theme === 'dark' ? '#090a0f' : '#f8f9fc',
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
        backgroundColor: theme === 'dark' ? '#090a0f' : '#f8f9fc',
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
    } catch {
      alert('Invalid JSON format.')
    }
  }

  return (
    <Dialog open={isExportOpen} onOpenChange={setExportOpen}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-secondary text-foreground">
              <HugeiconsIcon icon={Image01Icon} size={18} />
            </div>
            <div>
              <DialogTitle className="text-base font-bold" style={{ fontFamily: 'var(--font-display)' }}>
                Export & Share Tier List
              </DialogTitle>
              <DialogDescription className="text-xs">
                Save your tier ranking as a crisp 2x image graphic or JSON data file.
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
          <TabsList className="grid grid-cols-2 w-full bg-secondary">
            <TabsTrigger value="image" className="gap-1.5 text-xs font-bold font-mono">
              <HugeiconsIcon icon={Image01Icon} size={13} />
              Graphic (PNG)
            </TabsTrigger>
            <TabsTrigger value="json" className="gap-1.5 text-xs font-bold font-mono">
              <HugeiconsIcon icon={FileCodeIcon} size={13} />
              JSON Data
            </TabsTrigger>
          </TabsList>

          <TabsContent value="image" className="space-y-3 pt-3">
            <div className="p-3.5 rounded-lg bg-secondary/60 border border-border text-center space-y-1.5">
              <div className="w-8 h-8 mx-auto rounded-lg bg-foreground text-background flex items-center justify-center font-bold">
                <HugeiconsIcon icon={SparklesIcon} size={16} />
              </div>
              <h4 className="text-xs font-bold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>
                High-Resolution Graphic
              </h4>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                Renders a crisp, watermark-ready 2x PNG of your board, perfect for sharing on Discord, Reddit, and Twitter/X.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <Button
                type="button"
                onClick={handleDownloadPng}
                disabled={isExporting}
                className="w-full font-bold gap-2 bg-foreground text-background hover:opacity-90 h-9"
              >
                <HugeiconsIcon icon={Download01Icon} size={15} />
                <span>{isExporting ? 'Rendering...' : 'Download PNG'}</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={handleCopyClipboard}
                disabled={isExporting}
                className="w-full font-bold gap-2 bg-secondary border-border h-9"
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

          <TabsContent value="json" className="space-y-3 pt-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground font-mono">
                Tier List Configuration
              </span>
              <Button
                variant="outline"
                size="xs"
                onClick={handleExportJson}
                className="gap-1.5 text-xs font-mono font-semibold h-7"
              >
                <HugeiconsIcon icon={Download01Icon} size={13} />
                <span>Download .json</span>
              </Button>
            </div>

            <form onSubmit={handleImportJson} className="space-y-2 pt-2 border-t border-border">
              <label className="block text-xs font-semibold text-foreground font-mono">
                Import from JSON:
              </label>
              <textarea
                rows={4}
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder="Paste tier list JSON here..."
                className="w-full px-3 py-2 text-xs bg-secondary border border-border rounded-lg text-foreground font-mono placeholder:text-muted-foreground focus:outline-hidden focus:border-rose-500"
              />
              <Button
                type="submit"
                disabled={!jsonInput.trim() || jsonSuccess}
                className="w-full gap-1.5 h-8 font-semibold text-xs"
              >
                {jsonSuccess ? (
                  <>
                    <HugeiconsIcon icon={Tick02Icon} size={14} className="text-emerald-400" />
                    <span>Imported Successfully!</span>
                  </>
                ) : (
                  <>
                    <HugeiconsIcon icon={Upload01Icon} size={14} />
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
