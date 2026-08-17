import { Controller, Get } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'

@ApiTags('Health')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'Check service health status' })
  check() {
    return {
      status: 'ok',
      service: 'tier-list-api',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    }
  }
}
