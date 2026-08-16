import { useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Download01Icon,
  Layers01Icon,
  SparklesIcon,
  FileImportIcon,
  Shield01Icon,
  Tick02Icon,
  Copy01Icon,
  FlashIcon,
} from '@hugeicons/core-free-icons'
import { COLOR_PRESETS } from '../../lib/constants'
import { Link } from '@tanstack/react-router'

export default function BentoFeatureGrid() {
  const [selectedPalette, setSelectedPalette] = useState(COLOR_PRESETS[0])
  const [copiedSim, setCopiedSim] = useState(false)
  const [bulkInput, setBulkInput] = useState('Elden Ring\nZelda: Tears of the Kingdom\nBaldur\'s Gate 3\nCyberpunk 2077')

  const parsedCount = bulkInput.split('\n').filter((l) => l.trim().length > 0).length

  const handleSimulateCopy = () => {
    setCopiedSim(true)
    setTimeout(() => setCopiedSim(false), 2000)
  }

  return (
    <section id="features" className="relative py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-18">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold uppercase tracking-wider mb-4">
            <HugeiconsIcon icon={SparklesIcon} size={14} />
            <span>Power & Ease</span>
          </div>
          <h2
            className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Made for Effortless Tier Creation
          </h2>
          <p className="text-base sm:text-lg text-zinc-300">
            Everything you need to rank, organize, broadcast, and export your tier lists without ads, watermarks, or lag.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Smooth Drag & Drop */}
          <div className="lg:col-span-2 rounded-3xl p-6 sm:p-8 bg-zinc-900/80 border border-white/15 backdrop-blur-xl relative overflow-hidden flex flex-col justify-between group hover:border-white/25 transition-all">
            <div className="relative z-10">
              <div className="inline-flex p-3 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20 mb-4">
                <HugeiconsIcon icon={FlashIcon} size={24} />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                Smooth & Responsive Drag and Drop
              </h3>
              <p className="text-sm sm:text-base text-zinc-300 max-w-xl leading-relaxed">
                Cards glide smoothly into position and snap into place instantly. No clunky lag, even with hundreds of items.
              </p>
            </div>

            {/* Visual Graphic */}
            <div className="mt-8 pt-6 border-t border-white/10 relative">
              <div className="grid grid-cols-4 gap-3 bg-zinc-950/70 p-4 rounded-2xl border border-white/10">
                {['#ef4444', '#f97316', '#eab308', '#22c55e'].map((col, idx) => (
                  <div
                    key={col}
                    className="h-16 rounded-xl border border-white/10 flex flex-col items-center justify-center p-2 relative overflow-hidden group/item cursor-pointer"
                    style={{ backgroundColor: `${col}15`, borderColor: `${col}40` }}
                  >
                    <span className="text-xs font-mono font-bold" style={{ color: col }}>
                      Tier {['S', 'A', 'B', 'C'][idx]}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-mono mt-0.5">
                      {idx === 0 ? 'Snap in place' : 'Ready'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Card 2: Instant High-Res Export */}
          <div className="rounded-3xl p-6 sm:p-8 bg-zinc-900/80 border border-white/15 backdrop-blur-xl relative overflow-hidden flex flex-col justify-between group hover:border-white/25 transition-all">
            <div>
              <div className="inline-flex p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-4">
                <HugeiconsIcon icon={Download01Icon} size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Crystal-Clear Image Downloads
              </h3>
              <p className="text-sm text-zinc-300 leading-relaxed">
                Download crisp images ready for Twitter, Discord, and Reddit with a single click.
              </p>
            </div>

            {/* Interactive Export Button Simulation */}
            <div className="mt-6 pt-4 border-t border-white/10 space-y-3">
              <button
                type="button"
                onClick={handleSimulateCopy}
                className="w-full py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-white/10 text-xs font-bold text-white flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {copiedSim ? (
                  <>
                    <HugeiconsIcon icon={Tick02Icon} size={15} className="text-emerald-400" />
                    <span className="text-emerald-400">Copied Image to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <HugeiconsIcon icon={Copy01Icon} size={15} />
                    <span>Copy Clean Image to Clipboard</span>
                  </>
                )}
              </button>
              <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                <span>PNG & JPG formats</span>
                <span>Watermark customizable</span>
              </div>
            </div>
          </div>

          {/* Card 3: Color Themes */}
          <div className="rounded-3xl p-6 sm:p-8 bg-zinc-900/80 border border-white/15 backdrop-blur-xl relative overflow-hidden flex flex-col justify-between group hover:border-white/25 transition-all">
            <div>
              <div className="inline-flex p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-4">
                <HugeiconsIcon icon={SparklesIcon} size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Curated Color Palettes
              </h3>
              <p className="text-sm text-zinc-300 leading-relaxed mb-4">
                Choose from beautiful color presets or pick your own custom colors for every tier row.
              </p>
            </div>

            {/* Interactive Palette Swatches */}
            <div className="mt-2 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-white font-mono">
                  {selectedPalette.name}
                </span>
                <span className="text-[10px] font-mono text-zinc-400">
                  {selectedPalette.bg}
                </span>
              </div>
              <div className="grid grid-cols-6 gap-2">
                {COLOR_PRESETS.slice(0, 12).map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedPalette(p)}
                    title={p.name}
                    className={`h-7 rounded-lg transition-transform cursor-pointer border ${
                      selectedPalette.id === p.id
                        ? 'scale-110 border-white ring-2 ring-white/50'
                        : 'border-white/10 hover:scale-105'
                    }`}
                    style={{ backgroundColor: p.bg }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Card 4: Pre-loaded Collections */}
          <div className="rounded-3xl p-6 sm:p-8 bg-zinc-900/80 border border-white/15 backdrop-blur-xl relative overflow-hidden flex flex-col justify-between group hover:border-white/25 transition-all">
            <div>
              <div className="inline-flex p-3 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 mb-4">
                <HugeiconsIcon icon={Layers01Icon} size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Ready-Made Collections
              </h3>
              <p className="text-sm text-zinc-300 leading-relaxed">
                Jump straight into ranking with ready-made lists for Games, Movies, Sports, Anime, Tech, and Foods.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 grid grid-cols-3 gap-2 text-center text-xs font-mono font-semibold">
              <Link
                to="/templates/$templateId"
                params={{ templateId: 'games' }}
                className="p-2 rounded-xl bg-zinc-950/80 hover:bg-zinc-800 border border-white/10 text-zinc-300 hover:text-white cursor-pointer transition-all"
              >
                🎮 Games
              </Link>
              <Link
                to="/templates/$templateId"
                params={{ templateId: 'cinema' }}
                className="p-2 rounded-xl bg-zinc-950/80 hover:bg-zinc-800 border border-white/10 text-zinc-300 hover:text-white cursor-pointer transition-all"
              >
                🎬 Cinema
              </Link>
              <Link
                to="/templates/$templateId"
                params={{ templateId: 'football' }}
                className="p-2 rounded-xl bg-zinc-950/80 hover:bg-zinc-800 border border-white/10 text-zinc-300 hover:text-white cursor-pointer transition-all"
              >
                ⚽ Football
              </Link>
            </div>
          </div>

          {/* Card 5: Bulk Import & Custom Media */}
          <div className="rounded-3xl p-6 sm:p-8 bg-zinc-900/80 border border-white/15 backdrop-blur-xl relative overflow-hidden flex flex-col justify-between group hover:border-white/25 transition-all">
            <div>
              <div className="inline-flex p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-4">
                <HugeiconsIcon icon={FileImportIcon} size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Quick Text & Image Import
              </h3>
              <p className="text-sm text-zinc-300 leading-relaxed">
                Paste lines of text or drag images from your computer to create cards in seconds.
              </p>
            </div>

            <div className="mt-4 pt-4 border-t border-white/10 space-y-2">
              <textarea
                value={bulkInput}
                onChange={(e) => setBulkInput(e.target.value)}
                rows={3}
                placeholder="Paste items line by line..."
                className="w-full text-xs font-mono p-2.5 rounded-xl bg-zinc-950/80 border border-white/10 text-zinc-200 focus:outline-none focus:border-emerald-500/60 resize-none"
              />
              <div className="flex items-center justify-between text-[11px] font-mono text-emerald-400">
                <span>✓ {parsedCount} items ready to rank</span>
                <span className="text-zinc-400">Instant setup</span>
              </div>
            </div>
          </div>

          {/* Card 6: 100% Privacy & Auto-Save */}
          <div className="lg:col-span-3 rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-zinc-900/90 via-zinc-900/80 to-zinc-950/90 border border-white/15 backdrop-blur-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 group hover:border-white/25 transition-all">
            <div className="flex items-start gap-4">
              <div className="p-3.5 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20 shrink-0">
                <HugeiconsIcon icon={Shield01Icon} size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-1">
                  100% Private & Saved on Your Device
                </h3>
                <p className="text-sm text-zinc-300 max-w-2xl leading-relaxed">
                  Your boards are automatically saved locally on your browser. No mandatory accounts, no spam emails, and you can download your data anytime.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="px-4 py-2 rounded-xl bg-zinc-950 border border-white/10 text-xs font-mono text-emerald-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Auto-Saved Locally</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
