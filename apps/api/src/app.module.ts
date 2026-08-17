import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PrismaModule } from './prisma/prisma.module'
import { HealthModule } from './health/health.module'
import { TemplatesModule } from './templates/templates.module'
import { TierListsModule } from './tier-lists/tier-lists.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    HealthModule,
    TemplatesModule,
    TierListsModule,
  ],
})
export class AppModule {}
