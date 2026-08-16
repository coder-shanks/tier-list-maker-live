import { useState, useEffect } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Sun01Icon,
  Moon02Icon,
  SparklesIcon,
  ArrowRight01Icon,
  StarIcon,
  Menu01Icon,
  Cancel01Icon,
  TvIcon,
} from "@hugeicons/core-free-icons"
import { useUiStore } from "../../store/useUiStore"
import { Link } from "@tanstack/react-router"
import { EXTERNAL_LINKS } from "@/lib/constants"

export default function LandingNavbar() {
  const theme = useUiStore((s) => s.theme)
  const toggleTheme = useUiStore((s) => s.toggleTheme)
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "Templates", href: "#templates" },
    { label: "Streamer Mode", href: "#streamer" },
    { label: "Shortcuts", href: "#shortcuts" },
    { label: "Why Us", href: "#why-us" },
  ]

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false)
    const el = document.querySelector(href)
    if (el) {
      el.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-zinc-950/85 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/40"
          : "bg-zinc-950/40 backdrop-blur-md border-b border-white/5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link
          to="/"
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden border border-white/20 bg-zinc-900 flex items-center justify-center shadow-md group-hover:scale-105 group-hover:border-rose-500/60 transition-all duration-300">
            <img
              src="/logo.png"
              alt="Live Tier List Maker"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-rose-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 leading-tight">
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-white group-hover:text-rose-400 transition-colors">
                LIVE TIER LIST
              </span>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-mono font-bold tracking-wider bg-rose-500/20 text-rose-400 border border-rose-500/30 shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                STUDIO
              </span>
            </div>
            <p className="text-[10px] text-zinc-400 font-mono tracking-tight hidden xs:block">
              Real-Time Creator Suite
            </p>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1 bg-zinc-900/60 border border-white/10 rounded-full px-3 py-1.5 backdrop-blur-md">
          {navLinks.map((link) => (
            <button
              key={link.label}
              type="button"
              onClick={() => handleNavClick(link.href)}
              className="px-3.5 py-1 text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/10 rounded-full transition-all cursor-pointer"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* GitHub Star Badge */}
          <a
            href={EXTERNAL_LINKS.GITHUB_REPO}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-white/10 text-zinc-300 hover:text-white text-xs font-mono transition-all active:scale-95 shadow-xs"
          >
            <HugeiconsIcon
              icon={StarIcon}
              size={14}
              className="text-amber-400 fill-amber-400"
            />
            <span className="font-semibold">Star on GitHub</span>
          </a>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            className="p-2 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-white/10 text-zinc-300 hover:text-white transition-all active:scale-95 cursor-pointer"
          >
            <HugeiconsIcon
              icon={theme === "dark" ? Sun01Icon : Moon02Icon}
              size={16}
            />
          </button>

          {/* Studio Quick Launch CTA */}
          <Link
            to="/templates/$templateId"
            params={{ templateId: "games" }}
            className="relative group inline-flex items-center gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 hover:from-rose-500 hover:to-amber-400 shadow-lg shadow-rose-600/30 hover:shadow-rose-600/50 active:scale-95 transition-all overflow-hidden cursor-pointer"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
            <HugeiconsIcon icon={SparklesIcon} size={15} />
            <span>Start Ranking Free</span>
            <HugeiconsIcon
              icon={ArrowRight01Icon}
              size={14}
              className="group-hover:translate-x-0.5 transition-transform"
            />
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-zinc-900 border border-white/10 text-zinc-300 hover:text-white"
          >
            <HugeiconsIcon
              icon={mobileMenuOpen ? Cancel01Icon : Menu01Icon}
              size={18}
            />
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/10 bg-zinc-950/95 backdrop-blur-2xl px-5 py-4 space-y-3 animate-in slide-in-from-top-4 duration-200">
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => (
              <button
                key={link.label}
                type="button"
                onClick={() => handleNavClick(link.href)}
                className="px-3 py-2 text-left text-xs font-semibold text-zinc-300 hover:text-white hover:bg-white/10 rounded-lg transition-all"
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-white/10 flex items-center justify-between">
            <Link
              to="/templates/$templateId"
              params={{ templateId: "games" }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 text-white font-bold text-xs"
            >
              <HugeiconsIcon icon={TvIcon} size={15} />
              <span>Launch Studio Now</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
