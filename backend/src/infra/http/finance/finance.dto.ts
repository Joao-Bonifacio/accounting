import z from 'zod'

export const zIncomeDTO = z.object({
  category: z.string(),
  value: z.number(),
  date: z.date().optional(),
})
export type IncomeDTO = z.infer<typeof zIncomeDTO>

export const zExpenseDTO = z.object({
  category: z.string(),
  value: z.number(),
  date: z.date().optional(),
})
export type ExpenseDTO = z.infer<typeof zExpenseDTO>

export const zWalletDTO = z.object({
  category: z.string(),
  deposited: z.number(),
  total: z.number(),
  notes: z.string().optional(),
})
export type WalletDTO = z.infer<typeof zWalletDTO>
