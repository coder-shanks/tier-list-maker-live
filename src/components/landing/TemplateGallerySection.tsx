import { useState, useMemo } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Layers01Icon,
  ArrowRight01Icon,
  SparklesIcon,
} from '@hugeicons/core-free-icons'
import { TEMPLATES } from '../../lib/constants'
import { Link } from '@tanstack/react-router'

export default function TemplateGallerySection() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const categories = useMemo(() => {
    const cats = new Set<string>()
    TEMPLATES.forEach((t) => {
      if (t.category) cats.add(t.category)
    })
    return Array.from(cats)
  }, [])

  const filteredTemplates = useMemo(() => {
    if (!activeCategory) return TEMPLATES
    return TEMPLATES.filter((t) => t.category === activeCategory)
  }, [activeCategory])

  return (
    <section id="templates" className="relative py-20 sm:py-28 bg-zinc-950/40 border-t border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono font-bold uppercase tracking-wider mb-4">
              <HugeiconsIcon icon={Layers01Icon} size={14} />
              <span>Ready-Made Templates</span>
            </div>
            <h2
              className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Popular Pre-Made Templates
            </h2>
            <p className="text-base text-zinc-300 mt-2 max-w-xl">
              Start ranking in seconds with pre-made collections with images and balanced tier rows.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveCategory(null)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                activeCategory === null
                  ? 'bg-white text-zinc-950 shadow-md'
                  : 'bg-zinc-900/80 text-zinc-400 hover:text-white border border-white/10'
              }`}
            >
              All ({TEMPLATES.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'bg-zinc-900/80 text-zinc-400 hover:text-white border border-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((tmpl) => (
            <div
              key={tmpl.id}
              className="group rounded-3xl p-6 bg-zinc-900/80 border border-white/15 hover:border-rose-500/50 backdrop-blur-xl transition-all duration-300 flex flex-col justify-between hover:shadow-2xl hover:shadow-rose-950/40 hover:-translate-y-1"
            >
              <div>
                {/* Header: Icon & Category */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-2.5 rounded-2xl bg-zinc-950 border border-white/10 shadow-md">
                      {tmpl.icon}
                    </span>
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-rose-400 transition-colors">
                        {tmpl.name}
                      </h3>
                      <span className="text-xs font-mono font-semibold text-zinc-400">
                        {tmpl.category}
                      </span>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-white/5 text-zinc-300 border border-white/10">
                    {tmpl.items.length} items
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed mb-6">
                  {tmpl.description}
                </p>

                {/* Sample Item Thumbnails Strip */}
                <div className="flex items-center gap-2 mb-6 overflow-hidden py-1">
                  {tmpl.items.slice(0, 4).map((it) => (
                    <div
                      key={it.id}
                      className="w-12 h-14 rounded-xl overflow-hidden border border-white/15 shrink-0 shadow-sm"
                      title={it.title}
                    >
                      <img
                        src={it.imageUrl}
                        alt={it.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                  ))}
                  {tmpl.items.length > 4 && (
                    <div className="w-12 h-14 rounded-xl border border-dashed border-white/20 bg-zinc-950 flex items-center justify-center text-[10px] font-mono text-zinc-400 font-bold shrink-0">
                      +{tmpl.items.length - 4}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <Link
                to="/templates/$templateId"
                params={{ templateId: tmpl.id }}
                className="w-full py-3 px-4 rounded-xl bg-zinc-800 hover:bg-rose-600 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 group/btn cursor-pointer shadow-md"
              >
                <HugeiconsIcon icon={SparklesIcon} size={15} />
                <span>Use Template</span>
                <HugeiconsIcon
                  icon={ArrowRight01Icon}
                  size={14}
                  className="group-hover/btn:translate-x-1 transition-transform"
                />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
