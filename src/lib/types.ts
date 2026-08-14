export type Tier = {
  id: string
  title: string
  color: string
  textColor?: string
}

export type TierItem = {
  id: string
  title: string
  imageUrl?: string
  category?: string
  subtitle?: string
  color?: string
}

export type TierListContainers = Record<string, string[]>

export type ItemSize = 'compact' | 'normal' | 'large'

export type ColorPreset = {
  id: string
  name: string
  bg: string
  text: string
  border?: string
}

export type TemplateData = {
  id: string
  name: string
  description: string
  icon: string
  category: string
  title: string
  subtitle: string
  author: string
  tiers: Tier[]
  items: TierItem[]
  containers: TierListContainers
}

export type TierListHistoryState = {
  title: string
  subtitle: string
  author: string
  tiers: Tier[]
  items: TierItem[]
  containers: TierListContainers
}

export type BlindChallengeMode = 'standard' | 'hardcore'

export type BlindChallengeHistoryEntry = {
  itemId: string
  tierId: string
  timestamp: number
}

export type BlindChallengeConfig = {
  mode: BlindChallengeMode
  tierCaps: Record<string, number>
  resetBoardFirst: boolean
}

export type BlindModeState = {
  isActive: boolean
  mode: BlindChallengeMode
  queue: string[]
  currentItemId: string | null
  lockedItemIds: string[]
  tierCaps: Record<string, number>
  history: BlindChallengeHistoryEntry[]
  startedAt: number | null
  completedAt: number | null
  totalItems: number
}