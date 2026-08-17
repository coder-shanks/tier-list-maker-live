import { HugeiconsIcon } from '@hugeicons/react'
import { StarIcon } from '@hugeicons/core-free-icons'

const TESTIMONIALS = [
  {
    quote:
      'Presentation mode is an absolute gamechanger for live stream rankings. Clean full screen, no annoying ads, and the roulette wheel kept everyone hyped.',
    author: 'User A',
    role: 'Content Creator & Streamer',
    badge: 'A',
    badgeColor: 'from-rose-500 to-orange-500',
    rating: 5,
  },
  {
    quote:
      'The high-resolution export looks super sharp when posted to social media. No blurry images or forced watermarks.',
    author: 'User B',
    role: 'Community Member',
    badge: 'B',
    badgeColor: 'from-amber-500 to-emerald-500',
    rating: 5,
  },
  {
    quote:
      'The blind challenge mode alone is so much fun. Cards snap into place instantly, and everything is completely free without signing up.',
    author: 'User C',
    role: 'Tier List Enthusiast',
    badge: 'C',
    badgeColor: 'from-cyan-500 to-indigo-500',
    rating: 5,
  },
]

const METRICS = [
  { value: '100%', label: 'Free & Ad-Free', sub: 'Pure focus on ranking' },
  { value: 'Instant', label: 'Smooth Movement', sub: 'Zero stutter or lag' },
  { value: 'High-Res', label: 'Crystal-Clear Export', sub: 'Crisp image downloads' },
  { value: '0s', label: 'Sign-Up Time', sub: 'Open and start ranking' },
]

export default function TestimonialsAndStatsSection() {
  return (
    <section className="relative py-20 sm:py-28 bg-secondary/30 dark:bg-zinc-950/70 border-t border-b border-border dark:border-white/10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Live Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-20">
          {METRICS.map((m) => (
            <div
              key={m.label}
              className="p-6 rounded-3xl bg-card/90 dark:bg-zinc-900/70 border border-border dark:border-white/10 backdrop-blur-md text-center group hover:border-rose-500/40 transition-all shadow-md"
            >
              <div
                className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 dark:from-rose-400 dark:via-orange-400 dark:to-amber-300 mb-1"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {m.value}
              </div>
              <div className="text-sm font-bold text-foreground mb-0.5">{m.label}</div>
              <div className="text-xs text-muted-foreground font-mono">{m.sub}</div>
            </div>
          ))}
        </div>

        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-mono font-bold uppercase tracking-wider mb-4">
            <HugeiconsIcon icon={StarIcon} size={14} />
            <span>Community Feedback</span>
          </div>
          <h2
            className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight leading-tight mb-3"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Loved by Everyday Creators & Rankers
          </h2>
          <p className="text-base text-muted-foreground">
            See why people love creating and sharing tier lists here.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, idx) => (
            <div
              key={idx}
              className="rounded-3xl p-6 sm:p-7 bg-card/90 dark:bg-zinc-900/80 border border-border dark:border-white/15 backdrop-blur-xl flex flex-col justify-between hover:border-foreground/20 dark:hover:border-white/25 transition-all shadow-md dark:shadow-xl"
            >
              <div>
                {/* Rating Stars */}
                <div className="flex items-center gap-1 mb-4 text-amber-500 dark:text-amber-400">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <HugeiconsIcon
                      key={i}
                      icon={StarIcon}
                      size={16}
                      className="fill-amber-500 dark:fill-amber-400 text-amber-500 dark:text-amber-400"
                    />
                  ))}
                </div>

                <p className="text-sm text-foreground/90 dark:text-zinc-300 leading-relaxed italic mb-6">
                  "{t.quote}"
                </p>
              </div>

              {/* Author Profile */}
              <div className="flex items-center gap-3 pt-4 border-t border-border dark:border-white/10">
                <div
                  className={`w-10 h-10 rounded-full bg-gradient-to-tr ${t.badgeColor} flex items-center justify-center font-extrabold text-white text-sm shadow-md`}
                >
                  {t.badge}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground leading-tight">
                    {t.author}
                  </h4>
                  <p className="text-xs text-muted-foreground font-mono">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
