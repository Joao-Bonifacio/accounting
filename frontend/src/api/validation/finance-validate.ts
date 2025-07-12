import z from 'zod'

export const incomeExpenseSchema = z.object({
  id: z.string().uuid(),
  category: z.string(),
  value: z.number(),
  date: z.date(),
})
export const walletSchema = z.object({
  id: z.string().uuid(),
  category: z.string(),
  deposited: z.number(),
  total: z.number(),
  notes: z.string().optional(),
})
export const balanceSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  incomes: z.array(incomeExpenseSchema),
  expenses: z.array(incomeExpenseSchema),
  wallets: z.array(walletSchema),
  cash: z.number(),
  investments: z.number(),
  patrimony: z.number(),
  debts: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const movmentWalletSchema = z.object({
  value: z.number(),
  category: z.string(),
})

export const addIncomeExpenseSchema = z.object({
  category: z.string(),
  value: z.number(),
  date: z.date().optional(),
})
