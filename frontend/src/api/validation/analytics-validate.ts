import z from 'zod'

const patrimonySchema = z.object({
  value: z.number(),
  month: z.string().datetime({ offset: true }),
})
const incomeExpenseSchema = z.object({
  category: z.string(),
  value: z.number(),
  month: z.string().datetime({ offset: true }),
})
const walletSchema = z.object({
  category: z.string(),
  total: z.number(),
  month: z.string().datetime({ offset: true }),
})
export const analyticsSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  patrimony: z.array(patrimonySchema),
  incomes: z.array(incomeExpenseSchema),
  expenses: z.array(incomeExpenseSchema),
  wallets: z.array(walletSchema),
  createdAt: z.date(),
  updatedAt: z.date(),
})
