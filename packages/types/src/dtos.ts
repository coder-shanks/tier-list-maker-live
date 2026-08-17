import type { TierItem, TierList, TierRow, Template } from './models'

export interface CreateTierListDto {
  title: string
  description?: string
  category?: string
  isPublic?: boolean
  rows: Array<{ name: string; color: string; order: number }>
  items: Array<{ label: string; imageUrl: string }>
}

export interface UpdateTierListDto {
  title?: string
  description?: string
  category?: string
  isPublic?: boolean
  rows?: TierRow[]
  unrankedItems?: TierItem[]
}

export interface CreateTemplateDto {
  title: string
  description?: string
  category: string
  coverImage?: string
  defaultRows: Array<{ name: string; color: string }>
  defaultItems: Array<{ label: string; imageUrl: string }>
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
