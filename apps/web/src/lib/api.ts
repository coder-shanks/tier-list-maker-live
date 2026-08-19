import type {
  CreateTemplateDto,
  CreateTierListDto,
  TemplateCategory,
  TemplateData,
  TierList,
  UpdateTierListDto,
} from '@tier/types'

const API_BASE = '/api'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  })

  if (!res.ok) {
    const errorText = await res.text().catch(() => res.statusText)
    throw new Error(`API Error [${res.status}]: ${errorText}`)
  }

  return res.json()
}

export const api = {
  // Templates
  async getTemplates(category?: string, search?: string): Promise<TemplateData[]> {
    const params = new URLSearchParams()
    if (category && category !== 'All') params.set('category', category)
    if (search && search.trim()) params.set('search', search.trim())
    const query = params.toString() ? `?${params.toString()}` : ''
    return request<TemplateData[]>(`/templates${query}`)
  },

  async getTemplateById(id: string): Promise<TemplateData | null> {
    return request<TemplateData>(`/templates/${id}`).catch(() => null)
  },

  async getCategories(): Promise<TemplateCategory[]> {
    return request<TemplateCategory[]>('/templates/categories')
  },

  async createTemplate(dto: CreateTemplateDto): Promise<TemplateData> {
    return request<TemplateData>('/templates', {
      method: 'POST',
      body: JSON.stringify(dto),
    })
  },

  // Tier Lists
  async getTierLists(): Promise<TierList[]> {
    return request<TierList[]>('/tier-lists')
  },

  async getTierListById(id: string): Promise<TierList | null> {
    return request<TierList>(`/tier-lists/${id}`).catch(() => null)
  },

  async createTierList(dto: CreateTierListDto): Promise<TierList> {
    return request<TierList>('/tier-lists', {
      method: 'POST',
      body: JSON.stringify(dto),
    })
  },

  async updateTierList(id: string, dto: UpdateTierListDto): Promise<TierList> {
    return request<TierList>(`/tier-lists/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(dto),
    })
  },

  // Health
  async checkHealth(): Promise<{ status: string }> {
    return request<{ status: string }>('/health')
  },
}
