import { useState, useCallback } from 'react'
import {
  DragDropProvider,
  DragOverlay,
  useDraggable,
  useDroppable,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/react'
import { move } from '@dnd-kit/helpers'
import confetti from 'canvas-confetti'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  SparklesIcon,
  RefreshIcon,
  ArrowRight01Icon,
  DicesIcon,
  Layers01Icon,
} from '@hugeicons/core-free-icons'
import { useNavigate } from '@tanstack/react-router'
import { useTierDataStore } from '../../store/useTierDataStore'

interface SandboxItem {
  id: string
  title: string
  category: string
  imageUrl: string
}

const INITIAL_ITEMS: SandboxItem[] = [
  {
    id: 'sb-1',
    title: 'Elden Ring',
    category: 'Gaming',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/en/b/b9/Elden_Ring_Box_art.jpg',
  },
  {
    id: 'sb-2',
    title: 'Zelda: Tears of the Kingdom',
    category: 'Adventure',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/en/f/fb/The_Legend_of_Zelda_Tears_of_the_Kingdom_cover.jpg',
  },
  {
    id: 'sb-3',
    title: 'The Dark Knight',
    category: 'Cinema',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/en/1/1c/The_Dark_Knight_%282008_film%29.jpg',
  },
  {
    id: 'sb-4',
    title: 'Cyberpunk 2077',
    category: 'Sci-Fi RPG',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/en/9/9f/Cyberpunk_2077_box_art.jpg',
  },
  {
    id: 'sb-5',
    title: 'Authentic Ramen',
    category: 'Delicacy',
    imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&auto=format&fit=crop&q=80',
  },
]

const TIERS = [
  { id: 'TIER_S', label: 'S', title: 'BEST', color: '#ef4444', border: '#dc2626' },
  { id: 'TIER_A', label: 'A', title: 'GREAT', color: '#f97316', border: '#ea580c' },
  { id: 'TIER_B', label: 'B', title: 'GOOD', color: '#eab308', border: '#ca8a04' },
]

function SandboxCard({
  item,
  size,
  isOverlay = false,
}: {
  item: SandboxItem
  size: 'compact' | 'normal' | 'large'
  isOverlay?: boolean
}) {
  const { ref, isDragging } = useDraggable({ id: item.id })

  const sizeClasses = {
    compact: 'w-16 h-16 sm:w-20 sm:h-20 text-[10px]',
    normal: 'w-20 h-20 sm:w-24 sm:h-24 text-xs',
    large: 'w-24 h-24 sm:w-28 sm:h-28 text-xs',
  }[size]

  return (
    <div
      ref={ref}
      className={`group relative select-none rounded-xl overflow-hidden cursor-grab active:cursor-grabbing shrink-0 border border-white/15 bg-zinc-900 shadow-md transition-all ${sizeClasses} ${
        isDragging && !isOverlay ? 'opacity-30 scale-95' : 'hover:scale-[1.04] hover:shadow-xl hover:border-white/40'
      } ${isOverlay ? 'shadow-2xl ring-2 ring-rose-500 scale-105 rotate-2 z-50 cursor-grabbing' : ''}`}
    >
      <img
        src={item.imageUrl}
        alt={item.title}
        className="w-full h-full object-cover pointer-events-none transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-1.5 pointer-events-none">
        <span className="font-bold text-white leading-tight line-clamp-1 drop-shadow-md">
          {item.title}
        </span>
        <span className="text-[9px] text-zinc-400 font-mono line-clamp-1">
          {item.category}
        </span>
      </div>
    </div>
  )
}

function SandboxTierRow({
  tier,
  items,
  size,
}: {
  tier: (typeof TIERS)[number]
  items: SandboxItem[]
  size: 'compact' | 'normal' | 'large'
}) {
  const { ref, isDropTarget } = useDroppable({ id: tier.id })

  return (
    <div
      ref={ref}
      className={`flex items-stretch rounded-2xl border transition-all overflow-hidden ${
        isDropTarget
          ? 'ring-2 ring-rose-500/80 bg-rose-500/10 border-rose-500/50 scale-[1.008]'
          : 'border-white/10 bg-zinc-950/70 hover:border-white/20'
      }`}
    >
      {/* Tier Label Badge */}
      <div
        className="w-16 sm:w-24 shrink-0 flex flex-col items-center justify-center p-2 text-white font-extrabold select-none transition-all relative overflow-hidden"
        style={{ backgroundColor: tier.color }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
        <span className="text-2xl sm:text-3xl tracking-tight leading-none drop-shadow-md">
          {tier.label}
        </span>
        <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-widest opacity-90 font-bold mt-0.5">
          {tier.title}
        </span>
      </div>

      {/* Droppable Items Container */}
      <div className="flex-1 p-2 sm:p-2.5 flex items-center gap-2 sm:gap-2.5 overflow-x-auto min-h-[76px] sm:min-h-[96px] bg-zinc-900/40 backdrop-blur-md">
        {items.length === 0 ? (
          <div className="w-full text-center py-3 text-[11px] font-mono text-zinc-500 italic select-none">
            Drop cards here or onto {tier.label}
          </div>
        ) : (
          items.map((item) => <SandboxCard key={item.id} item={item} size={size} />)
        )}
      </div>
    </div>
  )
}

function SandboxPool({
  items,
  size,
}: {
  items: SandboxItem[]
  size: 'compact' | 'normal' | 'large'
}) {
  const { ref, isDropTarget } = useDroppable({ id: 'POOL' })

  return (
    <div
      ref={ref}
      className={`rounded-2xl border p-3 transition-all ${
        isDropTarget
          ? 'ring-2 ring-cyan-500/70 bg-cyan-500/10 border-cyan-500/40'
          : 'border-white/10 bg-zinc-950/60'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-zinc-400">
          <HugeiconsIcon icon={Layers01Icon} size={14} className="text-zinc-500" />
          <span>Unranked Cards ({items.length})</span>
        </div>
        <span className="text-[10px] font-mono text-zinc-500">
          Drag cards to rank above ↗
        </span>
      </div>

      <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto min-h-[80px] p-1">
        {items.length === 0 ? (
          <div className="w-full text-center py-3 text-xs font-mono text-emerald-400 flex items-center justify-center gap-1.5">
            <HugeiconsIcon icon={SparklesIcon} size={14} />
            <span>All cards placed! Looks great.</span>
          </div>
        ) : (
          items.map((item) => <SandboxCard key={item.id} item={item} size={size} />)
        )}
      </div>
    </div>
  )
}

export default function HeroTierSandbox() {
  const navigate = useNavigate()
  const [items] = useState<SandboxItem[]>(INITIAL_ITEMS)
  const [size, setSize] = useState<'compact' | 'normal' | 'large'>('normal')
  const [activeDragId, setActiveDragId] = useState<string | null>(null)

  const [containers, setContainers] = useState<Record<string, string[]>>({
    TIER_S: ['sb-1'],
    TIER_A: ['sb-2'],
    TIER_B: [],
    POOL: ['sb-3', 'sb-4', 'sb-5'],
  })

  const activeItem = items.find((it) => it.id === activeDragId)

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const sourceId = event.operation?.source?.id as string | undefined
    if (sourceId) setActiveDragId(sourceId)
  }, [])

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveDragId(null)
      if (event.canceled) return

      const targetId = event.operation?.target?.id as string | undefined
      if (targetId === 'TIER_S') {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#ef4444', '#f97316', '#eab308', '#ffffff'],
        })
      }

      setContainers((prev) => move(prev, event))
    },
    [],
  )

  const handleReset = () => {
    setContainers({
      TIER_S: ['sb-1'],
      TIER_A: ['sb-2'],
      TIER_B: [],
      POOL: ['sb-3', 'sb-4', 'sb-5'],
    })
  }

  const handleShuffle = () => {
    const allIds = [...INITIAL_ITEMS.map((i) => i.id)].sort(() => Math.random() - 0.5)
    setContainers({
      TIER_S: allIds.slice(0, 1),
      TIER_A: allIds.slice(1, 2),
      TIER_B: allIds.slice(2, 3),
      POOL: allIds.slice(3),
    })
    confetti({
      particleCount: 30,
      spread: 50,
      origin: { y: 0.65 },
    })
  }

  const handleLaunchStudio = () => {
    useTierDataStore.getState().loadTemplate('games')
    navigate({ to: '/templates/$templateId', params: { templateId: 'games' } })
  }

  return (
    <div className="w-full relative rounded-3xl p-3 sm:p-5 bg-zinc-950/85 border border-white/15 backdrop-blur-2xl shadow-2xl shadow-black/80 overflow-hidden text-left">
      {/* Decorative Glow */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-sm shadow-emerald-500/50" />
          <span className="text-xs font-bold font-mono tracking-wider text-zinc-200 uppercase">
            Try It Out Below
          </span>
          <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/5 text-zinc-400 border border-white/10">
            Drag cards into tiers
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Card Size Selector */}
          <div className="flex items-center bg-zinc-900/90 border border-white/10 rounded-xl p-0.5 text-[11px] font-mono">
            {(['compact', 'normal', 'large'] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSize(s)}
                className={`px-2.5 py-1 rounded-lg capitalize transition-all cursor-pointer ${
                  size === s
                    ? 'bg-white/20 text-white font-bold shadow-xs'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {s[0].toUpperCase()}
              </button>
            ))}
          </div>

          {/* Shuffle Button */}
          <button
            type="button"
            onClick={handleShuffle}
            title="Randomize Items"
            className="p-1.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-white/10 text-zinc-300 hover:text-white transition-all active:scale-95 cursor-pointer flex items-center gap-1 text-xs px-2.5"
          >
            <HugeiconsIcon icon={DicesIcon} size={14} />
            <span className="hidden sm:inline text-[11px] font-medium">Shuffle</span>
          </button>

          {/* Reset Button */}
          <button
            type="button"
            onClick={handleReset}
            title="Reset cards"
            className="p-1.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-white/10 text-zinc-300 hover:text-white transition-all active:scale-95 cursor-pointer"
          >
            <HugeiconsIcon icon={RefreshIcon} size={14} />
          </button>
        </div>
      </div>

      {/* Interactive DnD Area */}
      <DragDropProvider onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="space-y-2 sm:space-y-2.5">
          {TIERS.map((tier) => {
            const itemIds = containers[tier.id] || []
            const tierItems = itemIds
              .map((id) => items.find((i) => i.id === id))
              .filter(Boolean) as SandboxItem[]

            return (
              <SandboxTierRow
                key={tier.id}
                tier={tier}
                items={tierItems}
                size={size}
              />
            )
          })}

          {/* Unranked Pool */}
          <SandboxPool
            items={
              (containers.POOL || [])
                .map((id) => items.find((i) => i.id === id))
                .filter(Boolean) as SandboxItem[]
            }
            size={size}
          />
        </div>

        {/* Drag Overlay */}
        <DragOverlay>
          {activeItem ? (
            <SandboxCard item={activeItem} size={size} isOverlay />
          ) : null}
        </DragOverlay>
      </DragDropProvider>

      {/* Sandbox Footer CTA */}
      <div className="mt-4 pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-zinc-400 font-mono text-[11px]">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-rose-500" />
          <span>Includes custom tiers, image uploads, blind challenge & image export</span>
        </div>
        <button
          type="button"
          onClick={handleLaunchStudio}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-white font-bold shadow-lg shadow-rose-500/25 hover:opacity-95 active:scale-95 transition-all cursor-pointer"
        >
          <span>Open in Full Studio</span>
          <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
        </button>
      </div>
    </div>
  )
}
