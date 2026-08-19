import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import type { CreateTierListDto, UpdateTierListDto, TierList } from '@tier/types'

@Injectable()
export class TierListsService {
  private memoryTierLists: Map<string, TierList> = new Map()

  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<TierList[]> {
    try {
      if (this.prisma.isConnected) {
        const lists = await this.prisma.tierList.findMany({
          where: { isPublic: true },
          include: {
            rows: { include: { items: true }, orderBy: { order: 'asc' } },
            items: { where: { rowId: null }, orderBy: { order: 'asc' } },
          },
          orderBy: { createdAt: 'desc' },
        })

        if (lists && lists.length > 0) {
          return lists.map((l) => ({
            id: l.id,
            title: l.title,
            subtitle: l.description || '',
            description: l.description,
            coverImage: l.coverImage,
            category: l.category,
            isPublic: l.isPublic,
            authorId: l.authorId,
            author: 'Creator',
            tiers: l.rows.map((r) => ({
              id: r.id,
              title: r.name,
              color: r.color,
            })),
            items: l.items.map((i) => ({
              id: i.id,
              title: i.label,
              imageUrl: i.imageUrl,
            })),
            containers: {
              ...Object.fromEntries(l.rows.map((r) => [r.id, r.items.map((i) => i.id)])),
              POOL: l.items.map((i) => i.id),
            },
            createdAt: l.createdAt.toISOString(),
            updatedAt: l.updatedAt.toISOString(),
          }))
        }
      }
    } catch {
      // Fallback to memory
    }

    return Array.from(this.memoryTierLists.values())
  }

  async findOne(id: string): Promise<TierList> {
    try {
      if (this.prisma.isConnected) {
        const l = await this.prisma.tierList.findUnique({
          where: { id },
          include: {
            rows: { include: { items: true }, orderBy: { order: 'asc' } },
            items: { where: { rowId: null }, orderBy: { order: 'asc' } },
          },
        })

        if (l) {
          return {
            id: l.id,
            title: l.title,
            subtitle: l.description || '',
            description: l.description,
            coverImage: l.coverImage,
            category: l.category,
            isPublic: l.isPublic,
            authorId: l.authorId,
            author: 'Creator',
            tiers: l.rows.map((r) => ({
              id: r.id,
              title: r.name,
              color: r.color,
            })),
            items: l.items.map((i) => ({
              id: i.id,
              title: i.label,
              imageUrl: i.imageUrl,
            })),
            containers: {
              ...Object.fromEntries(l.rows.map((r) => [r.id, r.items.map((i) => i.id)])),
              POOL: l.items.map((i) => i.id),
            },
            createdAt: l.createdAt.toISOString(),
            updatedAt: l.updatedAt.toISOString(),
          }
        }
      }
    } catch {
      // Fallback
    }

    const item = this.memoryTierLists.get(id)
    if (!item) {
      throw new NotFoundException(`Tier list #${id} not found`)
    }
    return item
  }

  async create(dto: CreateTierListDto): Promise<TierList> {
    const id = `list-${Date.now()}`
    const newList: TierList = {
      id,
      title: dto.title,
      subtitle: dto.subtitle || '',
      description: dto.description || '',
      category: dto.category || 'Custom',
      isPublic: dto.isPublic ?? true,
      author: dto.author || 'Live Streamer',
      tiers: dto.tiers,
      items: dto.items,
      containers: dto.containers,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    try {
      if (this.prisma.isConnected) {
        await this.prisma.tierList.create({
          data: {
            title: dto.title,
            description: dto.subtitle || dto.description,
            category: dto.category,
            isPublic: dto.isPublic ?? true,
          },
        })
      }
    } catch {
      // DB offline fallback
    }

    this.memoryTierLists.set(id, newList)
    return newList
  }

  async update(id: string, dto: UpdateTierListDto): Promise<TierList> {
    const existing = await this.findOne(id)
    const updated: TierList = {
      ...existing,
      title: dto.title ?? existing.title,
      subtitle: dto.subtitle ?? existing.subtitle,
      description: dto.description ?? existing.description,
      category: dto.category ?? existing.category,
      isPublic: dto.isPublic ?? existing.isPublic,
      tiers: dto.tiers ?? existing.tiers,
      items: dto.items ?? existing.items,
      containers: dto.containers ?? existing.containers,
      updatedAt: new Date().toISOString(),
    }

    this.memoryTierLists.set(id, updated)
    return updated
  }
}
