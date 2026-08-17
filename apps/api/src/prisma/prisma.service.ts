import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import { PrismaClient } from '@tier/db'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    try {
      await this.$connect()
    } catch (e) {
      console.warn(
        'Prisma connection warning: Database is not reachable or DATABASE_URL is not set.',
        e,
      )
    }
  }

  async onModuleDestroy() {
    await this.$disconnect()
  }
}
