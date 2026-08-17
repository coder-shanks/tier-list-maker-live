export interface UserProfile {
  id: string
  username: string
  avatarUrl?: string | null
  createdAt: string
}

export interface TierItem {
  id: string
  label: string
  imageUrl: string
  rowId?: string | null
  order: number
}

export interface TierRow {
  id: string
  name: string
  color: string
  order: number
  items: TierItem[]
}

export interface TierList {
  id: string
  title: string
  description?: string | null
  coverImage?: string | null
  category?: string | null
  isPublic: boolean
  authorId?: string | null
  author?: UserProfile | null
  rows: TierRow[]
  unrankedItems: TierItem[]
  createdAt: string
  updatedAt: string
}

export interface Template {
  id: string
  title: string
  description?: string | null
  coverImage?: string | null
  category: string
  usageCount: number
  defaultRows: Array<{ name: string; color: string }>
  defaultItems: Array<{ label: string; imageUrl: string }>
  createdAt: string
}
