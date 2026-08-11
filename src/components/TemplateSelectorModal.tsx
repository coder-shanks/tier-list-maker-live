import { useState, useMemo } from 'react'
import { useTierListStore } from '../store/useTierListStore'
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

export default function TemplateSelectorModal() {
  const {
    isTemplateOpen,
    setTemplateOpen,
    selectedTemplateId,
    loadTemplate,
  } = useTierListStore()

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
  }

  return (
    <Dialog open={isTemplateOpen} onOpenChange={setTemplateOpen}>
      <DialogContent className="sm:max-w-3xl max-h-[85vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="p-4 sm:p-5 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <HugeiconsIcon icon={Layers01Icon} size={20} />
            </div>
            <div>
              <DialogTitle className="text-base sm:text-lg font-bold">
                Choose a Tier List Template
              </DialogTitle>
              <DialogDescription className="text-xs">
                Select from {TEMPLATES.length} pre-loaded collections across gaming, anime, sports, music, and more.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Search & Category Filter Bar */}
        <div className="p-4 sm:px-6 pb-2 space-y-2.5 border-b border-border/60">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <HugeiconsIcon icon={Search01Icon} size={15} />
            </span>
            <Input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search templates by name, anime, sports, tech..."
              className="pl-9 h-8 text-xs bg-muted/30"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <button
              type="button"
              onClick={() => setSelectedCat(null)}
              className={`px-2.5 py-0.5 text-[11px] font-semibold rounded-lg shrink-0 transition-all ${
                selectedCat === null
                  ? 'bg-foreground text-background'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              All ({TEMPLATES.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCat(selectedCat === cat ? null : cat)}
                className={`px-2.5 py-0.5 text-[11px] font-semibold rounded-lg shrink-0 transition-all ${
                  selectedCat === cat
                    ? 'bg-indigo-600 text-white'
                    : 'bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-3">
          {filteredTemplates.length === 0 ? (
            <div className="py-12 text-center text-xs text-muted-foreground">
              No templates match "{search}".
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredTemplates.map((tmpl) => {
                const isSelected = selectedTemplateId === tmpl.id
                return (
                  <div
                    key={tmpl.id}
                    onClick={() => handleSelect(tmpl.id)}
                    className={`group relative p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-500 ring-2 ring-indigo-500/30 dark:ring-indigo-500/40 shadow-md'
                        : 'bg-muted/40 hover:bg-muted/80 border-border hover:border-muted-foreground/30 active:scale-[0.99]'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xl p-1.5 rounded-lg bg-background border border-border shadow-2xs">
                            {tmpl.icon}
                          </span>
                          <div>
                            <h4 className="font-bold text-xs sm:text-sm text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                              {tmpl.name}
                            </h4>
                            <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400">
                              {tmpl.category}
                            </span>
                          </div>
                        </div>
                        {isSelected && (
                          <Badge className="gap-1 text-[10px] bg-indigo-600 text-white">
                            <HugeiconsIcon icon={Tick02Icon} size={11} />
                            Active
                          </Badge>
                        )}
                      </div>

                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-2.5">
                        {tmpl.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-border/60 text-[11px] text-muted-foreground">
                      <span>
                        {tmpl.items.length} items • {tmpl.tiers.length} tiers
                      </span>
                      <span className="flex items-center gap-1 text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 font-semibold group-hover:translate-x-0.5 transition-all">
                        Load
                        <HugeiconsIcon icon={ArrowRight01Icon} size={13} />
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
