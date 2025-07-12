import { Test, TestingModule } from '@nestjs/testing'
import { AnalyticsController } from './analytics.controller'
import { AnalyticsStorage } from '@/infra/db/prisma/transactions/analytics.storage'
import { CacheStorage } from '@/infra/db/cache/cache.service'

describe('AnalyticsController', () => {
  let controller: AnalyticsController
  let analyticsStorage: AnalyticsStorage
  let cacheStorage: CacheStorage

  const mockAnalytics = {
    id: 'analytics-id',
    userId: 'user-123',
    patrimony: [],
    incomes: [],
    expenses: [],
    wallets: [],
    createdAt: '2024-07-01T00:00:00.000Z',
    updatedAt: '2024-07-01T00:00:00.000Z',
  }

  const userPayload = { sub: 'user-123', nickname: 'john_dee' }

  const mockAnalyticsStorage = {
    syncAnalytics: vi.fn().mockResolvedValue(mockAnalytics),
  }

  const mockCacheStorage = {
    get: vi.fn(),
    setex: vi.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnalyticsController],
      providers: [
        { provide: AnalyticsStorage, useValue: mockAnalyticsStorage },
        { provide: CacheStorage, useValue: mockCacheStorage },
      ],
    }).compile()

    controller = module.get(AnalyticsController)
    analyticsStorage = module.get(AnalyticsStorage)
    cacheStorage = module.get(CacheStorage)
  })

  it('should return analytics from cache if available', async () => {
    mockCacheStorage.get.mockResolvedValue(JSON.stringify(mockAnalytics))

    const result = await controller.getAnalytics(userPayload)

    expect(cacheStorage.get).toHaveBeenCalledWith('analytics-user-123')
    expect(result).toEqual(mockAnalytics)
    expect(analyticsStorage.syncAnalytics).not.toHaveBeenCalled()
  })

  it('should return analytics from DB and cache if cache is empty', async () => {
    mockCacheStorage.get.mockResolvedValue(null)

    const result = await controller.getAnalytics(userPayload)

    expect(cacheStorage.get).toHaveBeenCalledWith('analytics-user-123')
    expect(analyticsStorage.syncAnalytics).toHaveBeenCalledWith('user-123')
    expect(cacheStorage.setex).toHaveBeenCalledWith(
      'analytics-user-123',
      1800,
      JSON.stringify(mockAnalytics),
    )
    expect(result).toEqual(mockAnalytics)
  })

  it('should throw if analytics not found', async () => {
    mockCacheStorage.get.mockResolvedValue(null)
    mockAnalyticsStorage.syncAnalytics.mockResolvedValue(null)

    await expect(() => controller.getAnalytics(userPayload)).rejects.toThrow(
      'Analytics not found',
    )
  })
})
