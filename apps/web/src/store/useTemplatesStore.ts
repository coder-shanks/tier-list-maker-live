import { create } from 'zustand'
import { api } from '../lib/api'
import { TEMPLATES } from '../lib/constants'
import type { TemplateCategory, TemplateData, CreateTemplateDto } from '@tier/types'

interface TemplatesState {
  templates: TemplateData[]
  categories: TemplateCategory[]
  isLoading: boolean
  error: string | null

  // Actions
  fetchTemplates: (category?: string, search?: string) => Promise<TemplateData[]>
  fetchCategories: () => Promise<TemplateCategory[]>
  getTemplateById: (id: string) => Promise<TemplateData | null>
  createTemplate: (dto: CreateTemplateDto) => Promise<TemplateData>
}

// Derive initial categories from fallback constants
const defaultCategories: TemplateCategory[] = Array.from(
  TEMPLATES.reduce((map, t) => {
    map.set(t.category, (map.get(t.category) || 0) + 1)
    return map
  }, new Map<string, number>()),
).map(([name, count]) => {
  const iconMap: Record<string, string> = {
    Gaming: '🎮',
    Anime: '⚔️',
    Entertainment: '🦸',
    Sports: '⚽',
    Development: '💻',
    Lifestyle: '🍕',
    Custom: '✨',
  }
  return {
    id: name.toLowerCase(),
    name,
    icon: iconMap[name] || '📁',
    count,
  }
})

export const useTemplatesStore = create<TemplatesState>((set, get) => ({
  templates: TEMPLATES,
  categories: defaultCategories,
  isLoading: false,
  error: null,

  fetchTemplates: async (category?: string, search?: string) => {
    set({ isLoading: true, error: null })
    try {
      const data = await api.getTemplates(category, search)
      if (Array.isArray(data) && data.length > 0) {
        set({ templates: data, isLoading: false })
        return data
      }
      // If empty or offline, filter local
      let fallback = TEMPLATES
      if (category && category !== 'All') {
        fallback = fallback.filter((t) => t.category.toLowerCase() === category.toLowerCase())
      }
      if (search && search.trim()) {
        const q = search.toLowerCase()
        fallback = fallback.filter(
          (t) =>
            t.name.toLowerCase().includes(q) ||
            t.description.toLowerCase().includes(q) ||
            t.category.toLowerCase().includes(q),
        )
      }
      set({ templates: fallback, isLoading: false })
      return fallback
    } catch (err: any) {
      set({ error: err.message, isLoading: false })
      return get().templates
    }
  },

  fetchCategories: async () => {
    try {
      const cats = await api.getCategories()
      if (Array.isArray(cats) && cats.length > 0) {
        set({ categories: cats })
        return cats
      }
    } catch {
      // Ignore and keep local fallback
    }
    return get().categories
  },

  getTemplateById: async (id: string) => {
    // Check local store first
    const existing = get().templates.find((t) => t.id === id)
    if (existing) return existing

    try {
      const fetched = await api.getTemplateById(id)
      if (fetched) {
        set((state) => ({
          templates: [...state.templates.filter((t) => t.id !== id), fetched],
        }))
        return fetched
      }
    } catch {
      // Ignore
    }

    return TEMPLATES.find((t) => t.id === id) || null
  },

  createTemplate: async (dto: CreateTemplateDto) => {
    set({ isLoading: true })
    try {
      const created = await api.createTemplate(dto)
      set((state) => ({
        templates: [created, ...state.templates],
        isLoading: false,
      }))
      return created
    } catch (err: any) {
      // Fallback local creation
      const localCreated: TemplateData = {
        id: `tpl-${Date.now()}`,
        name: dto.name,
        description: dto.description,
        icon: dto.icon || '✨',
        category: dto.category,
        title: dto.title,
        subtitle: dto.subtitle,
        author: dto.author || 'Anonymous',
        tiers: dto.tiers,
        items: dto.items,
        containers: dto.containers,
        usageCount: 1,
        createdAt: new Date().toISOString(),
      }
      set((state) => ({
        templates: [localCreated, ...state.templates],
        isLoading: false,
      }))
      return localCreated
    }
  },
}))
