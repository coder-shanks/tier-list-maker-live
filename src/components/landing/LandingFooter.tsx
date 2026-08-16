import { HugeiconsIcon } from "@hugeicons/react"
import {
  SparklesIcon,
  ArrowRight01Icon,
  Sun01Icon,
  Moon02Icon,
  CommandIcon,
  StarIcon,
} from "@hugeicons/core-free-icons"
import { useUiStore } from "../../store/useUiStore"
import { Link } from "@tanstack/react-router"
import { EXTERNAL_LINKS } from "@/lib/constants"

export default function LandingFooter() {
  const theme = useUiStore((s) => s.theme)
  const toggleTheme = useUiStore((s) => s.toggleTheme)

  const footerShortcuts = [
    { key: "⌘Z", name: "Undo" },
    { key: "⌘Y", name: "Redo" },
    { key: "⌘E", name: "Export" },
    { key: "R", name: "Roulette" },
    { key: "P", name: "Present" },
    { key: "N", name: "Add Card" },
  ]

  return (
    <footer
      id="shortcuts"
      className="relative pt-16 sm:pt-24 pb-12 overflow-hidden bg-zinc-950"
    >
      {/* Background glow banner */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-rose-500/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Bottom CTA Banner Card */}
        <div className="relative rounded-3xl p-8 sm:p-14 bg-gradient-to-b from-zinc-900/90 to-zinc-950/90 border border-white/15 backdrop-blur-2xl shadow-2xl text-center overflow-hidden mb-16 sm:mb-20">
          {/* Ambient Glow */}
          <div className="absolute -top-32 -left-32 w-80 h-80 bg-rose-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono font-bold uppercase tracking-wider mb-4">
              <HugeiconsIcon icon={SparklesIcon} size={14} />
              <span>100% Free Forever</span>
            </div>

            <h2
              className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Ready to rank the best of the best?
            </h2>

            <p className="text-base sm:text-lg text-zinc-300 mb-8 max-w-xl mx-auto">
              Start building your tier list right now. No email required, zero
              ads, and instant high-res export.
            </p>

            <Link
              to="/templates/$templateId"
              params={{ templateId: "games" }}
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl font-extrabold text-sm sm:text-base text-white bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 hover:from-rose-500 hover:to-amber-400 shadow-2xl shadow-rose-600/40 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
            >
              <HugeiconsIcon icon={SparklesIcon} size={18} />
              <span>Launch Tier List Studio — It's Free</span>
              <HugeiconsIcon icon={ArrowRight01Icon} size={18} />
            </Link>
          </div>
        </div>

        {/* Shortcuts Cheat Sheet Strip */}
        <div className="py-6 px-6 rounded-2xl bg-zinc-900/50 border border-white/10 mb-12 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-400">
          <div className="flex items-center gap-2 text-white font-bold">
            <HugeiconsIcon
              icon={CommandIcon}
              size={16}
              className="text-rose-400"
            />
            <span>Studio Keyboard Shortcuts</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {footerShortcuts.map((sc) => (
              <div key={sc.key} className="flex items-center gap-1.5">
                <kbd className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-200 border border-white/10 text-[11px] font-bold">
                  {sc.key}
                </kbd>
                <span className="text-zinc-400 text-[11px]">{sc.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Minimalist Sub-Footer */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-400">
          <div className="flex items-center gap-2.5">
            <img src="/logo.png" alt="Logo" className="w-5 h-5 rounded" />
            <span className="text-zinc-200 font-bold">
              Live Tier List Maker
            </span>
            <span>•</span>
            <span>Ad-free tier list suite for creators</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={toggleTheme}
              className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <HugeiconsIcon
                icon={theme === "dark" ? Sun01Icon : Moon02Icon}
                size={14}
              />
              <span className="capitalize">
                {theme === "dark" ? "Light" : "Dark"} Mode
              </span>
            </button>

            <a
              href={EXTERNAL_LINKS.GITHUB_REPO}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-zinc-400 hover:text-white transition-colors"
            >
              <HugeiconsIcon icon={StarIcon} size={14} />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
