import type { Analytics } from '@/prisma/generated/mongo'
import { Injectable } from '@nestjs/common'
import { PrismaServiceMongo } from '../prisma.service'
import dayjs from 'dayjs'
import {
  groupByMonthAndCategory,
  groupWalletsByMonth,
} from '@/core/utils/analytics-parser'

@Injectable()
export class AnalyticsStorage {
  constructor(private prisma: PrismaServiceMongo) {}

  async create(userId: string): Promise<Analytics> {
    const analytics = await this.prisma.analytics.create({
      data: { userId }
    })

    return analytics
  }

  async updateAnalytics(
    userId: string,
    data: Partial<Analytics>
  ): Promise<Analytics> {
    const analytics = await this.prisma.analytics.update({
      where: { userId },
      data
    })

    return analytics
  }

  async syncAnalytics(userId: string): Promise<Analytics> {
    const balance = await this.prisma.balance.findUnique({ where: { userId } })
    if (!balance) throw new Error('Balance not found')

    const { incomes, expenses, wallets } = balance

    const patrimony = [
      {
        value: 44,
        month: dayjs().format('YYYY-MM')
      },
      {
        value: 44,
        month: dayjs().format('YYYY-MM')
      }
    ]

    const analytics = await this.updateAnalytics(userId, {
      incomes: groupByMonthAndCategory(incomes),
      expenses: groupByMonthAndCategory(expenses),
      wallets: groupWalletsByMonth(wallets),
      patrimony,
    })

    return analytics
  }

  async delete(userId: string): Promise<void> {
    await this.prisma.analytics.delete({ where: { userId } })
  }
}
