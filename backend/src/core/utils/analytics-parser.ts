import type { Wallet } from '@/prisma/generated/mongo'
import dayjs from 'dayjs'

const formatMonth = (date: Date) => dayjs(date).format('YYYY-MM')
const formatYear = (date: Date) => dayjs(date).format('YYYY')

export const groupWalletsByMonth = (wallets: Wallet[]) => {
  const map = new Map<string, number>()

  for (const wallet of wallets) {
    const month = formatMonth(wallet.date)
    const key = `${wallet.category}-${month}`
    const current = map.get(key) || 0
    map.set(key, current + wallet.deposited)
  }

  return Array.from(map.entries()).map(([key, total]) => {
    const [category, month] = key.split('-')
    return { category, total, month }
  })
}

export const groupWalletsByYear = (wallets: Wallet[]) => {
  const map = new Map<string, number>()

  for (const wallet of wallets) {
    const year = formatYear(wallet.date)
    const key = `${wallet.category}-${year}`
    const current = map.get(key) || 0
    map.set(key, current + wallet.deposited)
  }

  return Array.from(map.entries()).map(([key, total]) => {
    const [category, year] = key.split('-')
    return { category, total, year }
  })
}

export const groupByMonthAndCategory = (
  items: { category: string; value: number; date: Date }[],
) => {
  const map = new Map<string, number>()

  for (const item of items) {
    const month = formatMonth(item.date)
    const key = `${item.category}-${month}`
    const current = map.get(key) || 0
    map.set(key, current + item.value)
  }

  return Array.from(map.entries()).map(([key, value]) => {
    const [category, month] = key.split('-')
    return { category, value, month }
  })
}

export const groupByYearAndCategory = (
  items: { category: string; value: number; date: Date }[],
) => {
  const map = new Map<string, number>()

  for (const item of items) {
    const year = formatYear(item.date)
    const key = `${item.category}-${year}`
    const current = map.get(key) || 0
    map.set(key, current + item.value)
  }

  return Array.from(map.entries()).map(([key, value]) => {
    const [category, year] = key.split('-')
    return { category, value, year }
  })
}
