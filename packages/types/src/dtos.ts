import type { TemplateData, Tier, TierItem, TierList, TierListContainers } from './models'

export interface CreateTierListDto {
  title: string
  subtitle?: string
  description?: string
  category?: string
  isPublic?: boolean
  author?: string
  tiers: Tier[]
  items: TierItem[]
  containers: TierListContainers
}

export interface UpdateTierListDto {
  title?: string
  subtitle?: string
  description?: string
  category?: string
  isPublic?: boolean
  tiers?: Tier[]
  items?: TierItem[]
  containers?: TierListContainers
}

export interface CreateTemplateDto {
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

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface AppStatsDto {
  totalTemplates: number
  totalRankedLists: number
  activeStreamers: number
  communityCreations: number
}
