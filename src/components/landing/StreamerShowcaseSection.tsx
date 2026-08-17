import { useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  TvIcon,
  DicesIcon,
  EyeIcon,
  CommandIcon,
  Tick02Icon,
  ViewOffSlashIcon,
  RefreshIcon,
  SparklesIcon,
} from '@hugeicons/core-free-icons'
import confetti from 'canvas-confetti'
import { Link } from '@tanstack/react-router'

const ROULETTE_CARDS = [
  {
    id: 'r-1',
    title: 'Elden Ring',
    category: 'Action RPG',
    image: 'https://upload.wikimedia.org/wikipedia/en/b/b9/Elden_Ring_Box_art.jpg',
    color: '#ef4444',
  },
  {
    id: 'r-2',
    title: 'Zelda: TOTK',
    category: 'Adventure',
    image: 'https://upload.wikimedia.org/wikipedia/en/f/fb/The_Legend_of_Zelda_Tears_of_the_Kingdom_cover.jpg',
    color: '#f97316',
  },
  {
    id: 'r-3',
    title: "Baldur's Gate 3",
    category: 'CRPG',
    image: 'https://upload.wikimedia.org/wikipedia/en/1/12/Baldur%27s_Gate_III_cover_art.jpg',
    color: '#eab308',
  },
  {
    id: 'r-4',
    title: 'Cyberpunk 2077',
    category: 'Sci-Fi RPG',
    image: 'https://upload.wikimedia.org/wikipedia/en/9/9f/Cyberpunk_2077_box_art.jpg',
    color: '#06b6d4',
  },
  {
    id: 'r-5',
    title: 'The Witcher 3',
    category: 'Action RPG',
    image: 'https://upload.wikimedia.org/wikipedia/en/0/0c/Witcher_3_cover_art.jpg',
    color: '#6366f1',
  },
]

const BLIND_DECK = [
  {
    id: 'b-1',
    title: 'Red Dead Redemption 2',
    category: 'Masterpiece',
    image: 'https://upload.wikimedia.org/wikipedia/en/4/44/Red_Dead_Redemption_II.jpg',
  },
  {
    id: 'b-2',
    title: 'God of War Ragnarök',
    category: 'Action Adventure',
    image: 'https://upload.wikimedia.org/wikipedia/en/e/ee/God_of_War_Ragnar%C3%B6k_cover.jpg',
  },
  {
    id: 'b-3',
    title: 'Minecraft',
    category: 'Sandbox Classic',
    image: 'https://upload.wikimedia.org/wikipedia/en/5/51/Minecraft_cover.png',
  },
  {
    id: 'b-4',
    title: 'Grand Theft Auto V',
    category: 'Open World',
    image: 'https://upload.wikimedia.org/wikipedia/en/a/a5/Grand_Theft_Auto_V.png',
  },
  {
    id: 'b-5',
    title: 'Hollow Knight',
    category: 'Metroidvania',
    image: 'https://upload.wikimedia.org/wikipedia/en/0/04/Hollow_Knight_first_cover_art.webp',
  },
]

const KEYBOARD_SHORTCUTS = [
  { key: '⌘ + Z', name: 'Instant Undo', desc: 'Undo any placement mistake in one click.' },
  { key: '⌘ + E', name: 'Quick Export', desc: 'Open crystal-clear image export dialog.' },
  { key: 'R', name: 'Spin Roulette', desc: 'Pick a random unranked item live on stream.' },
  { key: 'B', name: 'Blind Challenge', desc: 'Play blind ranking without knowing what comes next.' },
  { key: 'P', name: 'Clean Stream View', desc: 'Hide all buttons for clean OBS screen shares.' },
  { key: 'N', name: 'Quick Add Card', desc: 'Quickly add or paste new items.' },
]

export default function StreamerShowcaseSection() {
  const [activeTab, setActiveTab] = useState<'roulette' | 'blind'>('roulette')

  // Roulette Simulator State
  const [isSpinning, setIsSpinning] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)

  // Blind Challenge Simulator State
  const [blindIndex, setBlindIndex] = useState(0)
  const [blindSlots, setBlindSlots] = useState<Record<number, typeof BLIND_DECK[0] | null>>({
    1: null,
    2: null,
    3: null,
    4: null,
    5: null,
  })
  const [blindCompleted, setBlindCompleted] = useState(false)

  // Keyboard shortcut active preview
  const [activeShortcut, setActiveShortcut] = useState<string | null>(null)

  const spinRoulette = () => {
    if (isSpinning) return
    setIsSpinning(true)

    let counter = 0
    const totalFlips = 20 + Math.floor(Math.random() * 10)
    let speed = 60

    const step = () => {
      counter++
      setSelectedIndex((prev) => (prev + 1) % ROULETTE_CARDS.length)

      if (counter < totalFlips) {
        speed += 10
        setTimeout(step, speed)
      } else {
        setIsSpinning(false)
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#ef4444', '#f97316', '#eab308', '#06b6d4', '#6366f1'],
        })
      }
    }

    setTimeout(step, speed)
  }

  const selectedPick = ROULETTE_CARDS[selectedIndex]

  // Blind challenge placement
  const currentBlindItem = BLIND_DECK[blindIndex]

  const handlePlaceBlindSlot = (slotNumber: number) => {
    if (blindSlots[slotNumber] || blindCompleted || !currentBlindItem) return

    const nextSlots = { ...blindSlots, [slotNumber]: currentBlindItem }
    setBlindSlots(nextSlots)

    if (blindIndex + 1 < BLIND_DECK.length) {
      setBlindIndex(blindIndex + 1)
    } else {
      setBlindCompleted(true)
      confetti({
        particleCount: 75,
        spread: 85,
        origin: { y: 0.6 },
        colors: ['#ec4899', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b'],
      })
    }
  }

  const resetBlindChallenge = () => {
    setBlindIndex(0)
    setBlindSlots({ 1: null, 2: null, 3: null, 4: null, 5: null })
    setBlindCompleted(false)
  }

  return (
    <section id="streamer" className="relative py-20 sm:py-28 overflow-hidden bg-secondary/30 dark:bg-zinc-950/60 border-t border-b border-border dark:border-white/10">
      {/* Radial accent glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-mono font-bold uppercase tracking-wider mb-4">
            <HugeiconsIcon icon={TvIcon} size={14} />
            <span>Built for Streamers & Creators</span>
          </div>
          <h2
            className="text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight leading-tight mb-4"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Live Stream Games & Audience Tools
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground">
            Interactive widgets made for Twitch, YouTube, Kick, and Discord streams. Zero clutter, exciting viewer games, and instant shortcuts.
          </p>
        </div>

        {/* 2-Column Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Mini-Game Widgets (Tabs for Roulette & Blind Mode) */}
          <div className="lg:col-span-7 rounded-3xl p-6 sm:p-8 bg-card/90 dark:bg-zinc-900/90 border border-border dark:border-white/15 backdrop-blur-xl shadow-xl dark:shadow-2xl relative overflow-hidden">
            {/* Widget Mode Selector Tabs */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-border dark:border-white/10 gap-2 flex-wrap">
              <div className="flex items-center gap-1 p-1 bg-secondary dark:bg-zinc-950/80 rounded-2xl border border-border dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setActiveTab('roulette')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'roulette'
                      ? 'bg-rose-600 text-white shadow-md'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <HugeiconsIcon icon={DicesIcon} size={15} />
                  <span>Live Roulette</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('blind')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'blind'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <HugeiconsIcon icon={ViewOffSlashIcon} size={15} />
                  <span>Blind Challenge</span>
                </button>
              </div>

              <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-ping" />
                PLAYABLE DEMO
              </span>
            </div>

            {/* TAB 1: Live Roulette Simulator */}
            {activeTab === 'roulette' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-foreground">
                      Live Item Roulette
                    </h3>
                    <p className="text-xs text-muted-foreground font-mono">
                      Spin to pick an unranked item live with your chat
                    </p>
                  </div>
                </div>

                {/* Selected Card Spotlight Stage */}
                <div className="relative py-2 flex flex-col items-center justify-center">
                  <div
                    className={`relative w-44 h-56 sm:w-48 sm:h-60 rounded-2xl overflow-hidden border-2 shadow-2xl transition-all duration-200 ${
                      isSpinning
                        ? 'scale-95 blur-[0.5px] border-amber-500 rotate-1'
                        : 'scale-100 border-rose-500 shadow-rose-500/30'
                    }`}
                  >
                    <img
                      src={selectedPick.image}
                      alt={selectedPick.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-3 text-left">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-300">
                        {selectedPick.category}
                      </span>
                      <h4 className="text-base font-bold text-white line-clamp-1">
                        {selectedPick.title}
                      </h4>
                    </div>

                    {isSpinning && (
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center">
                        <span className="text-xs font-mono font-bold text-amber-300 bg-black/80 px-2.5 py-1 rounded-full border border-amber-400/50 animate-pulse">
                          SPINNING...
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Mini Roulette Strip Carousel */}
                  <div className="flex items-center gap-2 mt-5 p-2 bg-secondary/70 dark:bg-zinc-950/80 rounded-2xl border border-border dark:border-white/10 max-w-full overflow-x-auto">
                    {ROULETTE_CARDS.map((card, idx) => (
                      <div
                        key={card.id}
                        onClick={() => {
                          if (!isSpinning) setSelectedIndex(idx)
                        }}
                        className={`w-12 h-14 rounded-xl overflow-hidden border transition-all shrink-0 cursor-pointer ${
                          idx === selectedIndex
                            ? 'border-rose-500 ring-2 ring-rose-500/50 scale-105'
                            : 'border-border dark:border-white/10 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={card.image}
                          alt={card.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Spin Trigger Button */}
                <div className="pt-3 border-t border-border dark:border-white/10 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    type="button"
                    disabled={isSpinning}
                    onClick={spinRoulette}
                    className="w-full sm:flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 hover:from-rose-500 hover:to-amber-400 shadow-lg shadow-rose-600/30 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <HugeiconsIcon
                      icon={DicesIcon}
                      size={16}
                      className={isSpinning ? 'animate-spin' : ''}
                    />
                    <span>{isSpinning ? 'Picking Random Item...' : '🎲 Spin Live Roulette'}</span>
                  </button>

                  <Link
                    to="/templates/$templateId"
                    params={{ templateId: 'games' }}
                    className="w-full sm:w-auto px-4 py-3 rounded-xl bg-secondary dark:bg-zinc-800 hover:bg-accent dark:hover:bg-zinc-700 text-foreground dark:text-zinc-200 text-xs font-semibold border border-border dark:border-white/10 transition-all text-center"
                  >
                    Try in Studio
                  </Link>
                </div>
              </div>
            )}

            {/* TAB 2: Blind Ranking Challenge Simulator */}
            {activeTab === 'blind' && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
                      <span>Blind Ranking Challenge</span>
                      <span className="text-[10px] font-mono font-bold bg-purple-500/20 text-purple-600 dark:text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full">
                        Mystery Mode
                      </span>
                    </h3>
                    <p className="text-xs text-muted-foreground font-mono">
                      Rank each card 1 to 5 without knowing what comes next!
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={resetBlindChallenge}
                    className="flex items-center gap-1 text-xs font-mono text-muted-foreground hover:text-foreground px-2.5 py-1 rounded-lg bg-secondary dark:bg-zinc-800 border border-border dark:border-white/10 cursor-pointer"
                  >
                    <HugeiconsIcon icon={RefreshIcon} size={12} />
                    <span>Reset</span>
                  </button>
                </div>

                {/* Blind Game Arena */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  {/* Current Mystery Card */}
                  <div className="md:col-span-5 flex flex-col items-center">
                    {!blindCompleted && currentBlindItem ? (
                      <div className="w-36 h-48 sm:w-40 sm:h-52 rounded-2xl overflow-hidden border-2 border-purple-500/80 shadow-xl shadow-purple-900/30 relative group animate-in zoom-in-95 duration-200">
                        <img
                          src={currentBlindItem.image}
                          alt={currentBlindItem.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-2.5 text-left">
                          <span className="text-[9px] font-mono font-bold text-purple-300 uppercase">
                            Card {blindIndex + 1} of {BLIND_DECK.length}
                          </span>
                          <h4 className="text-xs font-bold text-white leading-tight">
                            {currentBlindItem.title}
                          </h4>
                        </div>
                      </div>
                    ) : (
                      <div className="w-36 h-48 sm:w-40 sm:h-52 rounded-2xl border-2 border-dashed border-emerald-500/50 bg-emerald-500/10 flex flex-col items-center justify-center p-4 text-center">
                        <HugeiconsIcon icon={SparklesIcon} size={28} className="text-emerald-600 dark:text-emerald-400 mb-2" />
                        <span className="text-xs font-bold text-foreground">Challenge Finished!</span>
                        <span className="text-[10px] text-muted-foreground font-mono mt-1">All 5 spots locked</span>
                      </div>
                    )}
                    <span className="text-[11px] font-mono text-muted-foreground mt-2">
                      {!blindCompleted ? '👈 Choose slot on right' : '🎉 Great tier list!'}
                    </span>
                  </div>

                  {/* 5 Blind Slots (1 to 5) */}
                  <div className="md:col-span-7 space-y-2">
                    {[1, 2, 3, 4, 5].map((slotNum) => {
                      const placed = blindSlots[slotNum]
                      const rankColors: Record<number, string> = {
                        1: 'bg-rose-500 text-white',
                        2: 'bg-orange-500 text-white',
                        3: 'bg-amber-500 text-zinc-950',
                        4: 'bg-emerald-500 text-zinc-950',
                        5: 'bg-sky-500 text-zinc-950',
                      }

                      return (
                        <div
                          key={slotNum}
                          onClick={() => handlePlaceBlindSlot(slotNum)}
                          className={`p-2 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                            placed
                              ? 'bg-secondary/80 dark:bg-zinc-950/80 border-border dark:border-white/20'
                              : blindCompleted
                              ? 'bg-secondary/40 dark:bg-zinc-950/40 border-border/50 dark:border-white/5 opacity-50'
                              : 'bg-secondary/50 dark:bg-zinc-900/60 border-border dark:border-white/10 hover:border-purple-500/60 hover:bg-purple-500/10 cursor-pointer'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span
                              className={`w-6 h-6 rounded-lg text-xs font-black font-mono flex items-center justify-center shrink-0 ${rankColors[slotNum]}`}
                            >
                              #{slotNum}
                            </span>

                            {placed ? (
                              <div className="flex items-center gap-2">
                                <img
                                  src={placed.image}
                                  alt={placed.title}
                                  className="w-7 h-7 rounded-md object-cover border border-border dark:border-white/20"
                                />
                                <span className="text-xs font-bold text-foreground line-clamp-1">
                                  {placed.title}
                                </span>
                              </div>
                            ) : (
                              <span className="text-xs text-muted-foreground font-mono">
                                Empty spot — click to place
                              </span>
                            )}
                          </div>

                          {placed ? (
                            <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 flex items-center gap-0.5">
                              <HugeiconsIcon icon={Tick02Icon} size={11} />
                              LOCKED
                            </span>
                          ) : (
                            <span className="text-[10px] font-mono font-bold text-purple-600 dark:text-purple-400">
                              + Assign
                            </span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Action CTA */}
                <div className="pt-3 border-t border-border dark:border-white/10 flex flex-col sm:flex-row items-center gap-3">
                  <Link
                    to="/templates/$templateId"
                    params={{ templateId: 'games' }}
                    className="w-full sm:flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 hover:from-purple-500 hover:to-pink-400 shadow-lg shadow-purple-600/30 active:scale-95 transition-all flex items-center justify-center gap-2 text-center"
                  >
                    <HugeiconsIcon icon={ViewOffSlashIcon} size={16} />
                    <span>Play Blind Challenge with 20+ Items</span>
                  </Link>

                  {blindCompleted && (
                    <button
                      type="button"
                      onClick={resetBlindChallenge}
                      className="w-full sm:w-auto px-4 py-3 rounded-xl bg-secondary dark:bg-zinc-800 hover:bg-accent dark:hover:bg-zinc-700 text-foreground dark:text-zinc-200 text-xs font-semibold border border-border dark:border-white/10 transition-all cursor-pointer"
                    >
                      Play Again
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Clean Stream View & Keyboard HUD */}
          <div className="lg:col-span-5 space-y-6">
            {/* Feature 1: Clean Stream View */}
            <div className="p-6 rounded-3xl bg-card/90 dark:bg-zinc-900/60 border border-border dark:border-white/10 backdrop-blur-md shadow-md">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 shrink-0">
                  <HugeiconsIcon icon={EyeIcon} size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-1">
                    1-Click Stream Presentation View
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                    Instantly hide all sidebars and buttons so your live stream or screen share looks clean and professional.
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-secondary text-[11px] font-mono text-foreground border border-border dark:border-white/10 flex items-center gap-1">
                      <HugeiconsIcon icon={Tick02Icon} size={12} className="text-emerald-600 dark:text-emerald-400" />
                      Zero Clutter
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-secondary text-[11px] font-mono text-foreground border border-border dark:border-white/10 flex items-center gap-1">
                      <HugeiconsIcon icon={Tick02Icon} size={12} className="text-emerald-600 dark:text-emerald-400" />
                      OBS Ready
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 2: Creator Keyboard Shortcuts */}
            <div className="p-6 rounded-3xl bg-card/90 dark:bg-zinc-900/60 border border-border dark:border-white/10 backdrop-blur-md shadow-md">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <HugeiconsIcon icon={CommandIcon} size={18} className="text-amber-500 dark:text-amber-400" />
                  <h3 className="text-base font-bold text-foreground">
                    Helpful Keyboard Shortcuts
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-muted-foreground">
                  Click key to preview
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {KEYBOARD_SHORTCUTS.map((sc) => {
                  const isCurrent = activeShortcut === sc.key
                  return (
                    <div
                      key={sc.key}
                      onClick={() => setActiveShortcut(isCurrent ? null : sc.key)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                        isCurrent
                          ? 'bg-rose-500/15 border-rose-500 ring-1 ring-rose-500/40 shadow-sm'
                          : 'bg-secondary/60 dark:bg-zinc-950/70 border-border dark:border-white/10 hover:border-foreground/20 dark:hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <kbd className="px-2 py-0.5 rounded-lg bg-background text-rose-600 dark:text-rose-400 font-mono text-xs font-bold border border-border dark:border-white/10 shadow-xs">
                          {sc.key}
                        </kbd>
                        <span className="text-xs font-bold text-foreground">
                          {sc.name}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-snug">
                        {sc.desc}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
