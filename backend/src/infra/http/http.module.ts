import { EnvModule } from '@/core/env/env.module'
import { Module } from '@nestjs/common'
import { DatabaseModule } from '../db/database.module'
import { SessionController } from './session/session.controller'
import { FinanceController } from './finance/finance.controller'
import { FinanceService } from './finance/finance.service'
import { AnalyticsController } from './analytics/analytics.controller'
import { SettingsController } from './settings/settings.controller'
import { BlockchainController } from './blockchain/blockchain.controller'

@Module({
  imports: [EnvModule, DatabaseModule],
  controllers: [
    SessionController,
    SettingsController,
    FinanceController,
    AnalyticsController,
    BlockchainController,
  ],
  providers: [FinanceService],
})
export class HttpModule {}
