import { useTierListStore } from '../store/useTierListStore'
import { TEMPLATES } from '../lib/constants'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Layers01Icon,
  Tick02Icon,
  ArrowRight01Icon,
} from '@hugeicons/core-free-icons'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'

export default function TemplateSelectorModal() {
  const {
    isTemplateOpen,
    setTemplateOpen,
    selectedTemplateId,
    loadTemplate,
  } = useTierListStore()

  const handleSelect = (templateId: string) => {
    loadTemplate(templateId)
    setTemplateOpen(false)
  }

  return (
    <Dialog open={isTemplateOpen} onOpenChange={setTemplateOpen}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] flex flex-col p-0 overflow-hidden">
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
                Select a pre-loaded collection or start completely fresh.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Templates Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {TEMPLATES.map((tmpl) => {
              const isSelected = selectedTemplateId === tmpl.id
              return (
                <div
                  key={tmpl.id}
                  onClick={() => handleSelect(tmpl.id)}
                  className={`group relative p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-500 ring-2 ring-indigo-500/30 dark:ring-indigo-500/40 shadow-md'
                      : 'bg-muted/40 hover:bg-muted/80 border-border hover:border-muted-foreground/30'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl p-1.5 rounded-xl bg-background border border-border shadow-2xs">
                          {tmpl.icon}
                        </span>
                        <div>
                          <h4 className="font-bold text-sm text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {tmpl.name}
                          </h4>
                          <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400">
                            {tmpl.category}
                          </span>
                        </div>
                      </div>
                      {isSelected && (
                        <Badge className="gap-1 text-[10px] bg-indigo-600 text-white">
                          <HugeiconsIcon icon={Tick02Icon} size={12} />
                          Active
                        </Badge>
                      )}
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                      {tmpl.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border/60 text-[11px] text-muted-foreground">
                    <span>
                      {tmpl.items.length} items • {tmpl.tiers.length} tiers
                    </span>
                    <span className="flex items-center gap-1 text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 font-semibold group-hover:translate-x-0.5 transition-all">
                      Load Template
                      <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
