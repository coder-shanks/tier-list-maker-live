export interface UserProfile {
  id: string
  username: string
  avatarUrl?: string | null
  createdAt: string
}

export interface Tier {
  id: string
  title: string
  color: string
  textColor?: string
}

export type TierRow = Tier


export interface TierItem {
  id: string
  title: string
  imageUrl?: string
  category?: string
  subtitle?: string
  color?: string
}

export type TierListContainers = Record<string, string[]>

export interface TemplateData {
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
  usageCount?: number
  createdAt?: string
}

export interface TierList {
  id: string
  title: string
  subtitle?: string | null
  description?: string | null
  coverImage?: string | null
  category?: string | null
  isPublic: boolean
  authorId?: string | null
  author?: UserProfile | string | null
  tiers: Tier[]
  items: TierItem[]
  containers: TierListContainers
  createdAt: string
  updatedAt: string
}

export interface TemplateCategory {
  id: string
  name: string
  icon: string
  count: number
}
