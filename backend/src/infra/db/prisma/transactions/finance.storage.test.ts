import { describe, it, expect, vi, beforeEach } from 'vitest'
import { PrismaServiceMongo } from '../prisma.service'
import { FinanceStorage } from './finace.storage'

const userId = 'user-id-123'
const income = { value: 100, category: 'salary', month: '2025-07' }
const expense = { value: 50, category: 'rent', month: '2025-07' }

const mockBalance = {
  userId,
  wallets: [
    { category: 'bank', deposited: 200, date: new Date(), notes: 'initial' }
  ]
}

const mockPrisma = {
  balance: {
    create: vi.fn(),
    findUnique: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  $transaction: vi.fn(),
} as unknown as PrismaServiceMongo

describe('FinanceStorage', () => {
  let storage: FinanceStorage

  beforeEach(() => {
    vi.clearAllMocks()
    storage = new FinanceStorage(mockPrisma)
  })

  it('create: should create a balance', async () => {
    mockPrisma.balance.create = vi.fn().mockResolvedValue(mockBalance)
    const result = await storage.create(userId)

    expect(result).toEqual(mockBalance)
    expect(mockPrisma.balance.create).toHaveBeenCalledWith({ data: { userId } })
  })

  it('getBalance: should return user balance', async () => {
    mockPrisma.balance.findUnique = vi.fn().mockResolvedValue(mockBalance)
    const result = await storage.getBalance(userId)

    expect(result).toEqual(mockBalance)
  })

  it('getBalance: should throw if not found', async () => {
    mockPrisma.balance.findUnique = vi.fn().mockResolvedValue(null)

    await expect(storage.getBalance(userId)).rejects.toThrowError('Balance not found')
  })

  it('addIncome: should update balance with new income', async () => {
    await storage.addIncome(userId, income)

    expect(mockPrisma.balance.update).toHaveBeenCalledWith({
      where: { userId },
      data: {
        incomes: { push: income },
        cash: { increment: income.value },
        patrimony: { increment: income.value },
      },
    })
  })

  it('addExpense: should update balance with new expense', async () => {
    await storage.addExpense(userId, expense)

    expect(mockPrisma.balance.update).toHaveBeenCalledWith({
      where: { userId },
      data: {
        expenses: { push: expense },
        cash: { increment: -expense.value },
        patrimony: { increment: -expense.value },
      },
    })
  })

  it('depositWallet: should deposit to wallet and update fields', async () => {
    const deposit = {
      category: 'bank',
      value: 150,
      notes: 'invest',
    }

    await storage.depositWallet(userId, deposit)

    expect(mockPrisma.balance.update).toHaveBeenCalledWith({
      where: { userId },
      data: {
        cash: { increment: -deposit.value },
        investments: { increment: deposit.value },
        wallets: {
          push: {
            category: 'bank',
            deposited: 150,
            date: undefined,
            notes: 'invest',
          },
        },
      },
    })
  })

  it('withdrawWallet: should withdraw value and update wallet', async () => {
    mockPrisma.balance.findUnique = vi.fn().mockResolvedValue(mockBalance)
    mockPrisma.$transaction = vi.fn().mockImplementation(async (callback) => {
      return await callback(mockPrisma)
    })

    await storage.withdrawWallet(userId, 'bank', 50)

    const updatedWallets = [
      { category: 'bank', deposited: 150, date: expect.any(Date), notes: 'initial' },
    ]

    expect(mockPrisma.$transaction).toHaveBeenCalled()
    expect(mockPrisma.balance.update).toHaveBeenCalledWith({
      where: { userId },
      data: {
        cash: { increment: 50 },
        investments: { increment: -50 },
        wallets: updatedWallets,
      },
    })
  })

  it('withdrawWallet: should throw if balance not found', async () => {
    mockPrisma.balance.findUnique = vi.fn().mockResolvedValue(null)

    await expect(storage.withdrawWallet(userId, 'bank', 100)).rejects.toThrow('Balance not found')
  })

  it('withdrawWallet: should throw if wallet category not found', async () => {
    mockPrisma.balance.findUnique = vi.fn().mockResolvedValue({
      userId,
      wallets: [],
    })

    await expect(storage.withdrawWallet(userId, 'bank', 100)).rejects.toThrow('Wallet not found')
  })

  it('delete: should delete balance by userId', async () => {
    mockPrisma.balance.delete = vi.fn().mockResolvedValue(undefined)

    await storage.delete(userId)

    expect(mockPrisma.balance.delete).toHaveBeenCalledWith({ where: { userId } })
  })
})
