import { HugeiconsIcon } from '@hugeicons/react'
import {
  SparklesIcon,
  ArrowRight01Icon,
  Layers01Icon,
  FlashIcon,
  Shield01Icon,
  Download01Icon,
  TvIcon,
} from '@hugeicons/core-free-icons'
import HeroTierSandbox from './HeroTierSandbox'
import { Link } from '@tanstack/react-router'

export default function HeroSection() {
  const scrollToTemplates = () => {
    const el = document.querySelector('#templates')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const highlightBadges = [
    { icon: FlashIcon, label: 'Smooth Drag & Drop' },
    { icon: Shield01Icon, label: '100% Private on Your Device' },
    { icon: Download01Icon, label: 'High-Res Image Export' },
    { icon: TvIcon, label: 'Live Stream Clean Mode' },
  ]

  return (
    <section className="relative pt-8 sm:pt-14 pb-16 sm:pb-24 overflow-hidden">
      {/* Background Atmosphere Lights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[350px] sm:h-[450px] bg-gradient-to-tr from-rose-600/15 via-purple-600/10 to-amber-500/15 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Top Value Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-card/90 dark:bg-zinc-900/90 border border-border dark:border-white/15 text-xs font-mono text-foreground shadow-sm dark:shadow-md backdrop-blur-md mb-6 hover:border-rose-500/40 transition-all">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
          </span>
          <span className="text-foreground font-semibold">100% Free</span>
          <span className="text-muted-foreground">•</span>
          <span>Ad-Free Forever</span>
          <span className="text-muted-foreground">•</span>
          <span className="text-amber-600 dark:text-amber-400 font-semibold">Zero Sign-Up Required</span>
        </div>

        {/* Main Headline */}
        <h1
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground max-w-5xl mx-auto leading-[1.1] mb-6"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Rank Anything.{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-orange-400 to-amber-400">
            Stream Live.
          </span>{' '}
          Share Instantly.
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-xl text-muted-foreground max-w-3xl mx-auto font-normal leading-relaxed mb-8 sm:mb-10">
          The modern tier list maker for creators, streamers, and friends. Enjoy effortless drag-and-drop, presentation mode for streaming, a live roulette spinner, and crystal-clear image downloads.
        </p>

        {/* Primary Call-to-Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-12 sm:mb-16">
          <Link
            to="/templates/$templateId"
            params={{ templateId: 'games' }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl font-extrabold text-sm sm:text-base text-white bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 hover:from-rose-500 hover:to-amber-400 shadow-xl shadow-rose-600/30 hover:shadow-rose-600/50 hover:scale-[1.02] active:scale-95 transition-all duration-200 cursor-pointer"
          >
            <HugeiconsIcon icon={SparklesIcon} size={18} />
            <span>Create Your Tier List</span>
            <HugeiconsIcon icon={ArrowRight01Icon} size={18} />
          </Link>

          <button
            type="button"
            onClick={scrollToTemplates}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold text-sm sm:text-base text-foreground bg-card/90 dark:bg-zinc-900/80 hover:bg-secondary dark:hover:bg-zinc-800/90 border border-border dark:border-white/15 hover:border-border/80 dark:hover:border-white/30 backdrop-blur-md active:scale-95 transition-all cursor-pointer shadow-sm"
          >
            <HugeiconsIcon icon={Layers01Icon} size={18} />
            <span>Explore Pre-made Templates</span>
          </button>
        </div>

        {/* Highlight Trust Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 max-w-4xl mx-auto mb-10 sm:mb-14">
          {highlightBadges.map((badge) => (
            <div
              key={badge.label}
              className="flex items-center justify-center gap-2 p-2.5 sm:p-3 rounded-xl bg-card/80 dark:bg-zinc-900/50 border border-border dark:border-white/10 text-foreground text-xs sm:text-xs font-medium backdrop-blur-sm shadow-xs"
            >
              <HugeiconsIcon icon={badge.icon} size={16} className="text-rose-500 dark:text-rose-400 shrink-0" />
              <span className="truncate">{badge.label}</span>
            </div>
          ))}
        </div>

        {/* Hero Interactive Sandbox Mini Tier List */}
        <div className="max-w-4xl mx-auto">
          <HeroTierSandbox />
        </div>
      </div>
    </section>
  )
}
