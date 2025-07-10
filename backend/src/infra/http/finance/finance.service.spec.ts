import { describe, it, expect, vi, beforeEach } from 'vitest'
import { FinanceService } from './finance.service'
import { FinanceStorage } from '@/infra/db/prisma/transactions/finace.storage'

const userId = 'user-123'
const income = { value: 100, category: 'salary', month: '2025-07' }
const expense = { value: 50, category: 'rent', month: '2025-07' }
const deposit = { category: 'bank', value: 200, date: new Date(), notes: 'note' }

const mockStorage = {
  getBalance: vi.fn(),
  addIncome: vi.fn(),
  addExpense: vi.fn(),
  depositWallet: vi.fn(),
  withdrawWallet: vi.fn(),
} as unknown as FinanceStorage

describe('FinanceService', () => {
  let service: FinanceService

  beforeEach(() => {
    vi.clearAllMocks()
    service = new FinanceService(mockStorage)
  })

  it('should return user balance', async () => {
    const mockBalance = {
      id: 'balance-1',
      userId,
      cash: 0,
      investments: 0,
      patrimony: 0,
      debts: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      incomes: [],
      expenses: [],
      wallets: [],
    }
    vi.spyOn(mockStorage, 'getBalance').mockResolvedValue(mockBalance)

    const result = await service.getBalance(userId)

    expect(result).toEqual(mockBalance)
    expect(mockStorage.getBalance).toHaveBeenCalledWith(userId)
  })

  it('should add income', async () => {
    await service.addIncome(userId, income)

    expect(mockStorage.addIncome).toHaveBeenCalledWith(userId, income)
  })

  it('should add expense', async () => {
    await service.addExpense(userId, expense)

    expect(mockStorage.addExpense).toHaveBeenCalledWith(userId, expense)
  })

  it('should deposit to wallet', async () => {
    await service.depositWallet(userId, deposit)

    expect(mockStorage.depositWallet).toHaveBeenCalledWith(userId, deposit)
  })

  it('should withdraw from wallet', async () => {
    await service.withdrawWallet(userId, 'bank', 100)

    expect(mockStorage.withdrawWallet).toHaveBeenCalledWith(userId, 'bank', 100)
  })
})
