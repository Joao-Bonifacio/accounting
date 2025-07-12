import { Module } from '@nestjs/common'
import { UserStorage } from './prisma/transactions/user.storage'
import { S3Storage } from './image/s3.service'
import { EnvModule } from '@/core/env/env.module'
import {
  PrismaServiceMongo,
  PrismaServicePostgres,
} from './prisma/prisma.service'
import { CacheStorage } from './cache/cache.service'
import { FinanceStorage } from './prisma/transactions/finace.storage'
import { AnalyticsStorage } from './prisma/transactions/analytics.storage'

@Module({
  imports: [EnvModule],
  providers: [
    PrismaServicePostgres,
    PrismaServiceMongo,
    UserStorage,
    FinanceStorage,
    AnalyticsStorage,
    S3Storage,
    CacheStorage,
  ],
  exports: [
    UserStorage,
    FinanceStorage,
    AnalyticsStorage,
    S3Storage,
    CacheStorage,
  ],
})
export class DatabaseModule {}
