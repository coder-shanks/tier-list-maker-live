import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import type { CreateTierListDto, UpdateTierListDto, TierList } from '@tier/types'

@Injectable()
export class TierListsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<TierList[]> {
    try {
      const lists = await this.prisma.tierList.findMany({
        where: { isPublic: true },
        include: {
          rows: { include: { items: true }, orderBy: { order: 'asc' } },
          items: { where: { rowId: null }, orderBy: { order: 'asc' } },
          author: {
            select: { id: true, username: true, avatarUrl: true, createdAt: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      })

      return lists.map((l) => ({
        id: l.id,
        title: l.title,
        description: l.description,
        coverImage: l.coverImage,
        category: l.category,
        isPublic: l.isPublic,
        authorId: l.authorId,
        author: l.author
          ? { ...l.author, createdAt: l.author.createdAt.toISOString() }
          : null,
        rows: l.rows.map((r) => ({
          id: r.id,
          name: r.name,
          color: r.color,
          order: r.order,
          items: r.items.map((i) => ({
            id: i.id,
            label: i.label,
            imageUrl: i.imageUrl,
            rowId: i.rowId,
            order: i.order,
          })),
        })),
        unrankedItems: l.items.map((i) => ({
          id: i.id,
          label: i.label,
          imageUrl: i.imageUrl,
          rowId: i.rowId,
          order: i.order,
        })),
        createdAt: l.createdAt.toISOString(),
        updatedAt: l.updatedAt.toISOString(),
      }))
    } catch {
      return []
    }
  }

  async findOne(id: string): Promise<TierList> {
    try {
      const l = await this.prisma.tierList.findUnique({
        where: { id },
        include: {
          rows: { include: { items: true }, orderBy: { order: 'asc' } },
          items: { where: { rowId: null }, orderBy: { order: 'asc' } },
          author: {
            select: { id: true, username: true, avatarUrl: true, createdAt: true },
          },
        },
      })

      if (!l) {
        throw new NotFoundException(`Tier list #${id} not found`)
      }

      return {
        id: l.id,
        title: l.title,
        description: l.description,
        coverImage: l.coverImage,
        category: l.category,
        isPublic: l.isPublic,
        authorId: l.authorId,
        author: l.author
          ? { ...l.author, createdAt: l.author.createdAt.toISOString() }
          : null,
        rows: l.rows.map((r) => ({
          id: r.id,
          name: r.name,
          color: r.color,
          order: r.order,
          items: r.items.map((i) => ({
            id: i.id,
            label: i.label,
            imageUrl: i.imageUrl,
            rowId: i.rowId,
            order: i.order,
          })),
        })),
        unrankedItems: l.items.map((i) => ({
          id: i.id,
          label: i.label,
          imageUrl: i.imageUrl,
          rowId: i.rowId,
          order: i.order,
        })),
        createdAt: l.createdAt.toISOString(),
        updatedAt: l.updatedAt.toISOString(),
      }
    } catch (e) {
      if (e instanceof NotFoundException) throw e
      throw new NotFoundException(`Tier list #${id} not found`)
    }
  }

  async create(dto: CreateTierListDto): Promise<TierList> {
    const list = await this.prisma.tierList.create({
      data: {
        title: dto.title,
        description: dto.description,
        category: dto.category,
        isPublic: dto.isPublic ?? true,
        rows: {
          create: dto.rows.map((r) => ({
            name: r.name,
            color: r.color,
            order: r.order,
          })),
        },
        items: {
          create: dto.items.map((it, idx) => ({
            label: it.label,
            imageUrl: it.imageUrl,
            order: idx,
          })),
        },
      },
      include: {
        rows: { include: { items: true } },
        items: true,
      },
    })

    return this.findOne(list.id)
  }

  async update(id: string, dto: UpdateTierListDto): Promise<TierList> {
    await this.prisma.tierList.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
        category: dto.category,
        isPublic: dto.isPublic,
      },
    })
    return this.findOne(id)
  }
}
