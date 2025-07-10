import z from 'zod'
import {
  balanceSchema,
  incomeExpenseSchema,
  walletSchema,
} from '../finance-validate'

export type Balance = z.infer<typeof balanceSchema>
export type Wallet = z.infer<typeof walletSchema>
export type IncomeExpense = z.infer<typeof incomeExpenseSchema>
