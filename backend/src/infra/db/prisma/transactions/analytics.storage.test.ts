import { describe, it, expect, beforeEach, vi } from 'vitest'
import { PrismaServiceMongo } from '../prisma.service'
import { AnalyticsStorage } from './analytics.storage'
import { groupByMonthAndCategory, groupWalletsByMonth } from '@/core/utils/analytics-parser'
import dayjs from 'dayjs'

vi.mock('@/core/utils/analytics-parser', () => ({
  groupByMonthAndCategory: vi.fn((data) => data),
  groupWalletsByMonth: vi.fn((wallets) => wallets),
}))

const mockPrisma = {
  analytics: {
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  balance: {
    findUnique: vi.fn(),
  },
} as unknown as PrismaServiceMongo

const userId = 'user-id-123'

describe('AnalyticsStorage', () => {
  let storage: AnalyticsStorage

  beforeEach(() => {
    vi.clearAllMocks()
    storage = new AnalyticsStorage(mockPrisma)
  })

  it('should create analytics for a user', async () => {
    const mockAnalytics = { id: '1', userId }
    mockPrisma.analytics.create = vi.fn().mockResolvedValue(mockAnalytics)

    const result = await storage.create(userId)

    expect(mockPrisma.analytics.create).toHaveBeenCalledWith({
      data: { userId },
    })
    expect(result).toEqual(mockAnalytics)
  })

  it('should update analytics for a user', async () => {
    const data = { incomes: [], expenses: [] }
    const mockAnalytics = { id: '1', userId, ...data }
    mockPrisma.analytics.update = vi.fn().mockResolvedValue(mockAnalytics)

    const result = await storage.updateAnalytics(userId, data)

    expect(mockPrisma.analytics.update).toHaveBeenCalledWith({
      where: { userId },
      data,
    })
    expect(result).toEqual(mockAnalytics)
  })

  it('should sync analytics based on balance data', async () => {
    const balance = {
      incomes: [{ value: 100 }],
      expenses: [{ value: 50 }],
      wallets: [{ name: 'wallet1', value: 300 }],
    }
    const updatedAnalytics = { id: '1', userId, ...balance }

    mockPrisma.balance.findUnique = vi.fn().mockResolvedValue(balance)
    mockPrisma.analytics.update = vi.fn().mockResolvedValue(updatedAnalytics)

    const result = await storage.syncAnalytics(userId)

    expect(mockPrisma.balance.findUnique).toHaveBeenCalledWith({ where: { userId } })
    expect(groupByMonthAndCategory).toHaveBeenCalledWith(balance.incomes)
    expect(groupByMonthAndCategory).toHaveBeenCalledWith(balance.expenses)
    expect(groupWalletsByMonth).toHaveBeenCalledWith(balance.wallets)
    expect(mockPrisma.analytics.update).toHaveBeenCalledWith({
      where: { userId },
      data: {
        incomes: balance.incomes,
        expenses: balance.expenses,
        wallets: balance.wallets,
        patrimony: [
          {
            value: 44,
            month: dayjs().format('YYYY-MM'),
          },
          {
            value: 44,
            month: dayjs().format('YYYY-MM'),
          },
        ],
      },
    })
    expect(result).toEqual(updatedAnalytics)
  })

  it('should throw error if balance not found on sync', async () => {
    mockPrisma.balance.findUnique = vi.fn().mockResolvedValue(null)

    await expect(storage.syncAnalytics(userId)).rejects.toThrowError('Balance not found')
  })

  it('should delete analytics by userId', async () => {
    mockPrisma.analytics.delete = vi.fn().mockResolvedValue(undefined)

    await storage.delete(userId)

    expect(mockPrisma.analytics.delete).toHaveBeenCalledWith({ where: { userId } })
  })
})
