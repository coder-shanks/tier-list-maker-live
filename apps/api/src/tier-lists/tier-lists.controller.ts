import { Controller, Get, Post, Patch, Param, Body } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { TierListsService } from './tier-lists.service'
import type { CreateTierListDto, UpdateTierListDto } from '@tier/types'

@ApiTags('Tier Lists')
@Controller('tier-lists')
export class TierListsController {
  constructor(private readonly tierListsService: TierListsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all public tier lists' })
  findAll() {
    return this.tierListsService.findAll()
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a tier list by ID' })
  findOne(@Param('id') id: string) {
    return this.tierListsService.findOne(id)
  }

  @Post()
  @ApiOperation({ summary: 'Create a new tier list' })
  create(@Body() dto: CreateTierListDto) {
    return this.tierListsService.create(dto)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update tier list metadata or structure' })
  update(@Param('id') id: string, @Body() dto: UpdateTierListDto) {
    return this.tierListsService.update(id, dto)
  }
}
