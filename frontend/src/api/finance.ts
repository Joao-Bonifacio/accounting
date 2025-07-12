'use server'

import { cookies } from 'next/headers'
import { api } from './api-wrapper'
import { Balance } from './validation/types/finance'
import { validate } from './validation/zod-validate'
import {
  incomeExpenseSchema,
  movmentWalletSchema,
} from './validation/finance-validate'
import { revalidateTag } from 'next/cache'

export const getBalance = async (): Promise<Balance> => {
  const token = (await cookies()).get('access_token')
  if (!token) throw new Error('Unauthorized')

  const balance = await api('finance/balance', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((data) => data.json())
  if (!balance) throw new Error('Unable to get balance.')

  return balance
}

export const addIncome = async (data: FormData): Promise<void> => {
  const token = (await cookies()).get('access_token')
  const validation = validate(data, incomeExpenseSchema)
  if (!token || !validation.success) throw new Error('Unauthorized')

  const response = await api('/finance/income', {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    next: {
      tags: ['balance'],
    },
  })
  if (!response.ok) throw new Error('Unable to add income.')

  revalidateTag('balance')
}

export const addExpense = async (data: FormData): Promise<void> => {
  const token = (await cookies()).get('access_token')
  const validation = validate(data, incomeExpenseSchema)
  if (!token || !validation.success) throw new Error('Unauthorized')

  const response = await api('/finance/expense', {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    next: {
      tags: ['balance'],
    },
  })
  if (!response.ok) throw new Error('Unable to add expense.')

  revalidateTag('balance')
}

export const depositWallet = async (data: FormData): Promise<void> => {
  const token = (await cookies()).get('access_token')
  const validation = validate(data, movmentWalletSchema)
  if (!token || !validation.success) throw new Error('Unauthorized')

  const response = await api('/finance/wallet/deposit', {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    next: {
      tags: ['balance'],
    },
  })
  if (!response.ok) throw new Error('Unable to deposit.')

  revalidateTag('balance')
}

export const withdrawWallet = async (data: FormData): Promise<void> => {
  const token = (await cookies()).get('access_token')
  const validation = validate(data, movmentWalletSchema)
  if (!token || !validation.success) throw new Error('Unauthorized')

  const response = await api('/finance/wallet/withdraw', {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    next: {
      tags: ['balance'],
    },
  })
  if (!response.ok) throw new Error('Unable to withdraw.')

  revalidateTag('balance')
}
