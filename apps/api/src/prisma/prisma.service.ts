import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common'
import { PrismaClient } from '@tier/db'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name)
  public isConnected = false

  async onModuleInit() {
    if (!process.env.DATABASE_URL) {
      this.logger.log('DATABASE_URL not set — running with in-memory persistence.')
      this.isConnected = false
      return
    }

    try {
      await this.$connect()
      this.isConnected = true
      this.logger.log('Successfully connected to PostgreSQL database.')
    } catch (e) {
      this.isConnected = false
      this.logger.warn(
        'Database connection failed. Falling back to in-memory persistence.',
      )
    }
  }

  async onModuleDestroy() {
    if (this.isConnected) {
      await this.$disconnect()
    }
  }
}
