import { HugeiconsIcon } from '@hugeicons/react'
import {
  Tick02Icon,
  Cancel01Icon,
  SparklesIcon,
} from '@hugeicons/core-free-icons'

const COMPARISON_ROWS = [
  {
    feature: 'Ad-Free Experience',
    legacy: 'Overwhelmed with annoying popups, banner ads, and screen jumps',
    liveTier: '100% Ad-Free Forever • Clean, distraction-free environment',
    highlight: true,
  },
  {
    feature: 'Drag & Drop Experience',
    legacy: 'Clunky, slow dragging with annoying misclicks',
    liveTier: 'Silky smooth dragging with instant snap into place',
    highlight: true,
  },
  {
    feature: 'Image Export Quality',
    legacy: 'Low-quality blurry images with forced website watermarks',
    liveTier: 'Crystal-clear high-res image downloads & instant clipboard copy',
    highlight: true,
  },
  {
    feature: 'Streamer & Creator Tools',
    legacy: 'No streaming tools; cluttered interface that looks bad on stream',
    liveTier: '1-Click presentation view, live item roulette & blind challenge',
    highlight: true,
  },
  {
    feature: 'Account & Sign-Up',
    legacy: 'Mandatory sign-ups, email spam, and passwords to remember',
    liveTier: 'Zero Sign-Up Required • 100% Private, saved on your device',
    highlight: true,
  },
  {
    feature: 'Color Customization',
    legacy: 'Limited basic colors, rigid rows, awkward renaming',
    liveTier: 'Curated color themes, custom color picker, and inline editable tiers',
    highlight: false,
  },
]

export default function ComparisonMatrixSection() {
  return (
    <section id="why-us" className="relative py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-18">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono font-bold uppercase tracking-wider mb-4">
            <HugeiconsIcon icon={SparklesIcon} size={14} />
            <span>The Clear Difference</span>
          </div>
          <h2
            className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Why Ditch Legacy Tier Makers?
          </h2>
          <p className="text-base sm:text-lg text-zinc-300">
            See how Live Tier List Maker compares against slow, ad-heavy legacy websites.
          </p>
        </div>

        {/* Comparison Table / Matrix */}
        <div className="rounded-3xl border border-white/15 bg-zinc-900/80 backdrop-blur-2xl overflow-hidden shadow-2xl">
          {/* Table Header */}
          <div className="grid grid-cols-1 md:grid-cols-12 border-b border-white/10 bg-zinc-950/80 p-4 sm:p-6 text-sm font-bold">
            <div className="md:col-span-4 text-zinc-400 font-mono uppercase tracking-wider text-xs">
              Feature / Experience
            </div>
            <div className="hidden md:block md:col-span-4 text-zinc-400">
              Legacy Tier Tools
            </div>
            <div className="hidden md:block md:col-span-4 text-rose-400 font-mono text-xs uppercase tracking-wider">
              ✦ Live Tier List Maker
            </div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-white/10">
            {COMPARISON_ROWS.map((row, index) => (
              <div
                key={row.feature}
                className={`grid grid-cols-1 md:grid-cols-12 p-4 sm:p-6 gap-4 items-center transition-colors ${
                  index % 2 === 0 ? 'bg-transparent' : 'bg-white/[0.02]'
                }`}
              >
                {/* Feature Name */}
                <div className="md:col-span-4 font-bold text-white text-sm sm:text-base">
                  {row.feature}
                </div>

                {/* Legacy Tool */}
                <div className="md:col-span-4 flex items-start gap-2.5 text-xs sm:text-sm text-zinc-400">
                  <div className="p-1 rounded-md bg-rose-500/10 text-rose-400 shrink-0 mt-0.5">
                    <HugeiconsIcon icon={Cancel01Icon} size={14} />
                  </div>
                  <span>{row.legacy}</span>
                </div>

                {/* Live Tier List Maker */}
                <div className="md:col-span-4 flex items-start gap-2.5 text-xs sm:text-sm text-white font-medium">
                  <div className="p-1 rounded-md bg-emerald-500/15 text-emerald-400 shrink-0 mt-0.5">
                    <HugeiconsIcon icon={Tick02Icon} size={14} />
                  </div>
                  <span className="text-zinc-100">{row.liveTier}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
