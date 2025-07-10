import { FinanceStorage } from '@/infra/db/prisma/transactions/finace.storage'
import { Injectable } from '@nestjs/common'
import type { ExpenseDTO, IncomeDTO } from './finance.dto'
import type { Balance } from '@/prisma/generated/mongo'

@Injectable()
export class FinanceService {
  constructor(private finance: FinanceStorage) {}

  async getBalance(userId: string): Promise<Balance> {
    return await this.finance.getBalance(userId)
  }

  async addIncome(userId: string, newIncome: IncomeDTO): Promise<void> {
    return await this.finance.addIncome(userId, newIncome)
  }

  async addExpense(userId: string, newExpense: ExpenseDTO): Promise<void> {
    return await this.finance.addExpense(userId, newExpense)
  }

  async depositWallet(
    userId: string,
    upload: {
      category: string
      value: number
      date?: Date
      notes?: string
    },
  ): Promise<void> {
    return await this.finance.depositWallet(userId, upload)
  }

  async withdrawWallet(
    userId: string,
    category: string,
    value: number,
  ): Promise<void> {
    return await this.finance.withdrawWallet(userId, category, value)
  }
}
