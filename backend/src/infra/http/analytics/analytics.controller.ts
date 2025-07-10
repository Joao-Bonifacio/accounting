import type { UserPayload } from '@/infra/auth/jwt.strategy'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { AnalyticsStorage } from '@/infra/db/prisma/transactions/analytics.storage'
import { Controller, Get } from '@nestjs/common'
import { CacheStorage } from '@/infra/db/cache/cache.service'

@Controller('analytics')
export class AnalyticsController {
  constructor(
    private analytics: AnalyticsStorage,
    private cache: CacheStorage,
  ) {}

  @Get()
  async getAnalytics(@CurrentUser() { sub }: UserPayload) {
    const cached = await this.cache.get(`analytics-${sub}`)
    if (cached) return JSON.parse(cached)

    const analytics = await this.analytics.syncAnalytics(sub)
    if (!analytics) throw new Error('Analytics not found')

    await this.cache.setex(
      `analytics-${sub}`,
      // 3600 * 24, / 1 day
      3600 / 2, // 30 minutes
      JSON.stringify(analytics),
    )
    return analytics
  }
}
