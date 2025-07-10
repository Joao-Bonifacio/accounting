type Entry = { month: string; value: number }

export const mergeIncomesAndExpenses = (
  incomes: Entry[],
  expenses: Entry[],
): { month: string; incomes: number; expenses: number }[] => {
  const map = new Map<string, { incomes: number; expenses: number }>()

  for (const income of incomes) {
    const entry = map.get(income.month) || { incomes: 0, expenses: 0 }
    entry.incomes += income.value
    map.set(income.month, entry)
  }

  for (const expense of expenses) {
    const entry = map.get(expense.month) || { incomes: 0, expenses: 0 }
    entry.expenses += expense.value
    map.set(expense.month, entry)
  }

  return Array.from(map.entries())
    .map(([month, { incomes, expenses }]) => ({ month, incomes, expenses }))
    .sort((a, b) => a.month.localeCompare(b.month))
}

export const transformWalletsToLineData = (
  wallets: { category: string; month: string; total: number }[],
) => {
  const grouped = new Map<string, Record<string, number>>()
  const categories = new Set<string>()

  for (const { month, category, total } of wallets) {
    categories.add(category)
    if (!grouped.has(month)) grouped.set(month, {})
    grouped.get(month)![category] = (grouped.get(month)![category] || 0) + total
  }

  const chartData = Array.from(grouped.entries()).map(
    ([month, categoriesMap]) => {
      const filled = Object.fromEntries(
        Array.from(categories).map((cat) => [cat, categoriesMap[cat] ?? 0]),
      )
      return { month, ...filled }
    },
  )

  return chartData.sort((a, b) => a.month.localeCompare(b.month))
}

export const transformWalletsToPieData = (
  wallets: { category: string; month: string; total: number }[],
) => {
  const totals = new Map<string, number>()

  for (const { category, total } of wallets) {
    totals.set(category, (totals.get(category) || 0) + total)
  }

  const sorted = [...totals.entries()].sort((a, b) => b[1] - a[1])
  const top = sorted.slice(0, 4)
  const other = sorted.slice(4)

  const result = top.map(([category, total]) => ({
    category,
    total,
    fill: `var(--color-${category.toLowerCase().replace(/\s+/g, '-')})`,
  }))

  if (other.length > 0) {
    const otherTotal = other.reduce((acc, [, total]) => acc + total, 0)
    result.push({
      category: 'Other',
      total: otherTotal,
      fill: 'var(--color-other)',
    })
  }

  return result
}
