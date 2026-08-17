import { useState, useMemo } from 'react'
import { useUiStore } from '../store/useUiStore'
import { useMetadataStore } from '../store/useMetadataStore'
import { useTierDataStore } from '../store/useTierDataStore'
import { TEMPLATES } from '../lib/constants'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Layers01Icon,
  Tick02Icon,
  ArrowRight01Icon,
  Search01Icon,
} from '@hugeicons/core-free-icons'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { useNavigate } from '@tanstack/react-router'

export default function TemplateSelectorModal() {
  const navigate = useNavigate()
  const isTemplateOpen = useUiStore((s) => s.isTemplateOpen)
  const setTemplateOpen = useUiStore((s) => s.setTemplateOpen)

  const selectedTemplateId = useMetadataStore((s) => s.selectedTemplateId)
  const loadTemplate = useTierDataStore((s) => s.loadTemplate)

  const [search, setSearch] = useState('')
  const [selectedCat, setSelectedCat] = useState<string | null>(null)

  // Extract categories
  const categories = useMemo(() => {
    const cats = new Set<string>()
    TEMPLATES.forEach((t) => {
      if (t.category) cats.add(t.category)
    })
    return Array.from(cats)
  }, [])

  // Filter templates
  const filteredTemplates = useMemo(() => {
    return TEMPLATES.filter((t) => {
      const matchSearch =
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase()) ||
        t.category.toLowerCase().includes(search.toLowerCase())
      const matchCat = !selectedCat || t.category === selectedCat
      return matchSearch && matchCat
    })
  }, [search, selectedCat])

  const handleSelect = (templateId: string) => {
    loadTemplate(templateId)
    setTemplateOpen(false)
    navigate({ to: '/templates/$templateId', params: { templateId } })
  }

  return (
    <Dialog open={isTemplateOpen} onOpenChange={setTemplateOpen}>
      <DialogContent className="sm:max-w-3xl max-h-[85vh] flex flex-col p-0 overflow-hidden bg-card border-border">
        <DialogHeader className="p-4 sm:p-5 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-secondary text-foreground">
              <HugeiconsIcon icon={Layers01Icon} size={18} />
            </div>
            <div>
              <DialogTitle
                className="text-base sm:text-lg font-bold"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Curated Tier List Templates
              </DialogTitle>
              <DialogDescription className="text-xs">
                Select from {TEMPLATES.length} pre-built collections across gaming,
                cinema, tech, anime, and pop culture.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Search & Category Filter Bar */}
        <div className="p-3.5 sm:px-6 pb-2 space-y-2 border-b border-border">
          <div className="relative">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground">
              <HugeiconsIcon icon={Search01Icon} size={14} />
            </span>
            <Input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search templates by title, genre, keyword..."
              className="pl-8 h-8 text-xs bg-secondary border-border"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <button
              type="button"
              onClick={() => setSelectedCat(null)}
              className={`px-2.5 py-0.5 text-[11px] font-mono font-semibold rounded-md shrink-0 transition-all ${
                selectedCat === null
                  ? 'bg-foreground text-background'
                  : 'bg-secondary text-muted-foreground hover:text-foreground border border-border'
              }`}
            >
              All ({TEMPLATES.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCat(selectedCat === cat ? null : cat)}
                className={`px-2.5 py-0.5 text-[11px] font-mono font-semibold rounded-md shrink-0 transition-all ${
                  selectedCat === cat
                    ? 'bg-rose-600 text-white'
                    : 'bg-secondary text-muted-foreground hover:text-foreground border border-border'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-2.5">
          {filteredTemplates.length === 0 ? (
            <div className="py-12 text-center text-xs font-mono text-muted-foreground">
              No templates match "{search}".
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {filteredTemplates.map((tmpl) => {
                const isSelected = selectedTemplateId === tmpl.id
                return (
                  <div
                    key={tmpl.id}
                    onClick={() => handleSelect(tmpl.id)}
                    className={`group relative p-3 rounded-lg border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-secondary border-rose-500 ring-1 ring-rose-500/40 shadow-sm'
                        : 'bg-card hover:bg-secondary/70 border-border active:scale-[0.99]'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xl p-1.5 rounded bg-background border border-border">
                            {tmpl.icon}
                          </span>
                          <div>
                            <h4 className="font-bold text-xs sm:text-sm text-foreground group-hover:text-rose-500 transition-colors">
                              {tmpl.name}
                            </h4>
                            <span className="text-[10px] font-mono font-semibold text-muted-foreground">
                              {tmpl.category}
                            </span>
                          </div>
                        </div>
                        {isSelected && (
                          <Badge className="gap-1 text-[9px] font-mono bg-rose-600 text-white px-1.5 py-0">
                            <HugeiconsIcon icon={Tick02Icon} size={10} />
                            Active
                          </Badge>
                        )}
                      </div>

                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-2">
                        {tmpl.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-border text-[11px] font-mono text-muted-foreground">
                      <span>
                        {tmpl.items.length} items • {tmpl.tiers.length} tiers
                      </span>
                      <span className="flex items-center gap-1 text-foreground group-hover:text-rose-500 font-semibold group-hover:translate-x-0.5 transition-all">
                        Load
                        <HugeiconsIcon icon={ArrowRight01Icon} size={12} />
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
