import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import type { CreateTemplateDto, TemplateCategory, TemplateData } from '@tier/types'
import { DEFAULT_TEMPLATES } from './data/default-templates'

@Injectable()
export class TemplatesService {
  private memoryTemplates: Map<string, TemplateData> = new Map()

  constructor(private readonly prisma: PrismaService) {
    // Seed in-memory map with rich default templates
    DEFAULT_TEMPLATES.forEach((tpl) => {
      this.memoryTemplates.set(tpl.id, tpl)
    })
  }

  async findAll(category?: string, search?: string): Promise<TemplateData[]> {
    try {
      if (this.prisma.isConnected) {
        const dbTemplates = await this.prisma.template.findMany({
          where: {
            AND: [
              category && category !== 'All' ? { category } : {},
              search ? { title: { contains: search, mode: 'insensitive' } } : {},
            ],
          },
          orderBy: { usageCount: 'desc' },
        })

        if (dbTemplates && dbTemplates.length > 0) {
          return dbTemplates.map((t) => ({
            id: t.id,
            name: t.title,
            description: t.description || '',
            icon: '🏆',
            category: t.category,
            title: t.title,
            subtitle: t.description || '',
            author: 'Community',
            usageCount: t.usageCount,
            tiers: (t.defaultRows as any) || [],
            items: (t.defaultItems as any) || [],
            containers: {
              'tier-s': [],
              'tier-a': [],
              'tier-b': [],
              'tier-c': [],
              'tier-d': [],
              'tier-f': [],
              POOL: ((t.defaultItems as any[]) || []).map((i) => i.id),
            },
            createdAt: t.createdAt.toISOString(),
          }))
        }
      }
    } catch {
      // Fall through to memory store if DB is offline
    }

    let list = Array.from(this.memoryTemplates.values())
    if (category && category !== 'All') {
      list = list.filter((t) => t.category.toLowerCase() === category.toLowerCase())
    }
    if (search && search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.title.toLowerCase().includes(q),
      )
    }
    return list
  }

  async findOne(id: string): Promise<TemplateData | null> {
    try {
      if (this.prisma.isConnected) {
        const t = await this.prisma.template.findUnique({ where: { id } })
        if (t) {
          return {
            id: t.id,
            name: t.title,
            description: t.description || '',
            icon: '🏆',
            category: t.category,
            title: t.title,
            subtitle: t.description || '',
            author: 'Community',
            usageCount: t.usageCount,
            tiers: (t.defaultRows as any) || [],
            items: (t.defaultItems as any) || [],
            containers: {
              'tier-s': [],
              'tier-a': [],
              'tier-b': [],
              'tier-c': [],
              'tier-d': [],
              'tier-f': [],
              POOL: ((t.defaultItems as any[]) || []).map((i) => i.id),
            },
            createdAt: t.createdAt.toISOString(),
          }
        }
      }
    } catch {
      // fallback to memory
    }

    return this.memoryTemplates.get(id) || null
  }

  async getCategories(): Promise<TemplateCategory[]> {
    const templates = await this.findAll()
    const counts = new Map<string, number>()

    templates.forEach((t) => {
      counts.set(t.category, (counts.get(t.category) || 0) + 1)
    })

    const categoryIcons: Record<string, string> = {
      Gaming: '🎮',
      Anime: '⚔️',
      Entertainment: '🦸',
      Sports: '⚽',
      Development: '💻',
      Lifestyle: '🍕',
      Custom: '✨',
    }

    return Array.from(counts.entries()).map(([name, count]) => ({
      id: name.toLowerCase(),
      name,
      icon: categoryIcons[name] || '📁',
      count,
    }))
  }

  async create(dto: CreateTemplateDto): Promise<TemplateData> {
    const id = `tpl-${Date.now()}`
    const newTemplate: TemplateData = {
      id,
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

    try {
      if (this.prisma.isConnected) {
        await this.prisma.template.create({
          data: {
            title: dto.title,
            description: dto.description,
            category: dto.category,
            defaultRows: dto.tiers as any,
            defaultItems: dto.items as any,
          },
        })
      }
    } catch {
      // DB offline fallback
    }

    this.memoryTemplates.set(id, newTemplate)
    return newTemplate
  }
}
