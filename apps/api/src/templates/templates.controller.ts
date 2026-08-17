import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger'
import { TemplatesService } from './templates.service'
import type { CreateTemplateDto } from '@tier/types'

@ApiTags('Templates')
@Controller('templates')
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all community and official tier list templates' })
  @ApiQuery({ name: 'category', required: false, type: String })
  findAll(@Query('category') category?: string) {
    return this.templatesService.findAll(category)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a template by ID' })
  findOne(@Param('id') id: string) {
    return this.templatesService.findOne(id)
  }

  @Post()
  @ApiOperation({ summary: 'Create a new template' })
  create(@Body() dto: CreateTemplateDto) {
    return this.templatesService.create(dto)
  }
}
