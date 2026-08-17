import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import type { CreateTemplateDto, Template } from '@tier/types'

@Injectable()
export class TemplatesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(category?: string): Promise<Template[]> {
    try {
      const templates = await this.prisma.template.findMany({
        where: category ? { category } : undefined,
        orderBy: { usageCount: 'desc' },
      })
      return templates.map((t) => ({
        id: t.id,
        title: t.title,
        description: t.description,
        coverImage: t.coverImage,
        category: t.category,
        usageCount: t.usageCount,
        defaultRows: t.defaultRows as any,
        defaultItems: t.defaultItems as any,
        createdAt: t.createdAt.toISOString(),
      }))
    } catch {
      // Fallback mock templates if DB is disconnected
      return [
        {
          id: 'mock-1',
          title: 'Anime Tier List 2026',
          description: 'Rank the greatest anime series of all time',
          coverImage:
            'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80',
          category: 'Anime',
          usageCount: 1420,
          defaultRows: [
            { name: 'S', color: '#ef4444' },
            { name: 'A', color: '#f97316' },
            { name: 'B', color: '#eab308' },
            { name: 'C', color: '#22c55e' },
            { name: 'D', color: '#3b82f6' },
          ],
          defaultItems: [
            {
              label: 'Attack on Titan',
              imageUrl:
                'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=200&auto=format&fit=crop&q=80',
            },
            {
              label: 'Frieren',
              imageUrl:
                'https://images.unsplash.com/photo-1563089145-599997674d42?w=200&auto=format&fit=crop&q=80',
            },
          ],
          createdAt: new Date().toISOString(),
        },
        {
          id: 'mock-2',
          title: 'Competitive Gaming S-Tier',
          description: 'Top esports and competitive multiplayer titles',
          coverImage:
            'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80',
          category: 'Gaming',
          usageCount: 2890,
          defaultRows: [
            { name: 'God Tier', color: '#ec4899' },
            { name: 'Meta', color: '#8b5cf6' },
            { name: 'Viable', color: '#06b6d4' },
            { name: 'Niche', color: '#64748b' },
          ],
          defaultItems: [
            {
              label: 'Valorant',
              imageUrl:
                'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=200&auto=format&fit=crop&q=80',
            },
          ],
          createdAt: new Date().toISOString(),
        },
      ]
    }
  }

  async findOne(id: string): Promise<Template | null> {
    const list = await this.findAll()
    return list.find((t) => t.id === id) || null
  }

  async create(dto: CreateTemplateDto): Promise<Template> {
    const created = await this.prisma.template.create({
      data: {
        title: dto.title,
        description: dto.description,
        category: dto.category,
        coverImage: dto.coverImage,
        defaultRows: dto.defaultRows,
        defaultItems: dto.defaultItems,
      },
    })
    return {
      id: created.id,
      title: created.title,
      description: created.description,
      coverImage: created.coverImage,
      category: created.category,
      usageCount: created.usageCount,
      defaultRows: created.defaultRows as any,
      defaultItems: created.defaultItems as any,
      createdAt: created.createdAt.toISOString(),
    }
  }
}
