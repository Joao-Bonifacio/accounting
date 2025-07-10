import { Injectable } from '@nestjs/common'
import { PrismaServiceMongo } from '../prisma.service'
import type { Balance } from '@/prisma/generated/mongo'
import type {
  ExpenseDTO,
  IncomeDTO,
} from '@/infra/http/finance/finance.dto'

@Injectable()
export class FinanceStorage {
  constructor(private prisma: PrismaServiceMongo) {}

  async create(userId: string): Promise<Balance> {
    return await this.prisma.balance.create({ data: { userId } })
  }

  async getBalance(userId: string): Promise<Balance> {
    const balance = await this.prisma.balance.findUnique({ where: { userId } })
    if (!balance) throw new Error('Balance not found')

    return balance
  }

  async addIncome(userId: string, newIncome: IncomeDTO): Promise<void> {
    await this.prisma.balance.update({
      where: { userId },
      data: {
        incomes: { push: newIncome },
        cash: { increment: newIncome.value },
        patrimony: { increment: newIncome.value }
      }
    })
  }

  async addExpense(userId: string, newExpense: ExpenseDTO): Promise<void> {
    await this.prisma.balance.update({
      where: { userId },
      data: {
        expenses: { push: newExpense },
        cash: { increment: -newExpense.value },
        patrimony: { increment: -newExpense.value }
      }
    })
  }

  async depositWallet(
    userId: string,
    upload: { category: string; value: number; date?: Date, notes?: string },
  ): Promise<void> {
    await this.prisma.balance.update({
      where: { userId },
      data: {
        cash: { increment: -upload.value },
        investments: { increment: upload.value },
        wallets: {
          push: {
            category: upload.category,
            deposited: upload.value,
            date: upload.date || undefined,
            notes: upload.notes || undefined
          }
        }
      }
    })
  }

  async withdrawWallet(
    userId: string,
    category: string,
    value: number
  ): Promise<void> {
    const balance = await this.prisma.balance.findUnique({ where: { userId } })
    if (!balance) throw new Error('Balance not found')

    const walletIndex = balance.wallets.findIndex(
      (w) => w.category === category
    )
    if (walletIndex === -1) throw new Error('Wallet not found')

    const updatedWallets = [...balance.wallets]
    const targetWallet = { ...updatedWallets[walletIndex] }

    targetWallet.deposited -= value
    updatedWallets[walletIndex] = targetWallet

    await this.prisma.$transaction(async (tx) => {
      return tx.balance.update({
        where: { userId },
        data: {
          cash: { increment: value },
          investments: { increment: -value },
          wallets: updatedWallets
        }
      })
    })
  }

  async delete(userId: string): Promise<void> {
    await this.prisma.balance.delete({ where: { userId } })
  }
}
