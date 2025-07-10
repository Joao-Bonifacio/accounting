import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render } from '@testing-library/react'
import Dashboard from '@/app/dashboard/page'
import { getAnalytics } from '@/api/analytics'
import { getBalance } from '@/api/finance'

vi.mock('@/api/analytics', () => ({
  getAnalytics: vi.fn(),
}))
vi.mock('@/api/finance', () => ({
  getBalance: vi.fn(),
}))

vi.mock('@/components/dashboard/charts/patrimony-range', () => ({
  PatrimonyRange: ({ patrimony }: { patrimony: number }) => (
    <div data-testid="patrimony-range">{JSON.stringify(patrimony)}</div>
  ),
}))
vi.mock('@/components/dashboard/charts/Income-expence-range', () => ({
  IncomeExpenseRange: ({
    incomes,
    expenses,
  }: {
    incomes: { category: string; value: number; month: string }
    expenses: { category: string; value: number; month: string }
  }) => (
    <div data-testid="income-expense-range">
      {JSON.stringify({ incomes, expenses })}
    </div>
  ),
}))
vi.mock('@/components/dashboard/charts/investments-percentage', () => ({
  InvestmentsPercentage: ({
    patrimony,
    investments,
  }: {
    patrimony: number
    investments: number
  }) => (
    <div data-testid="investments-percentage">
      patrimony: {patrimony}, investments: {investments}
    </div>
  ),
}))
vi.mock('@/components/dashboard/charts/Investments-range', () => ({
  InvestmentsRange: ({
    wallets,
  }: {
    wallets: {
      category: string
      deposited: number
      total: number
      notes: string
    }
  }) => <div data-testid="investments-range">{JSON.stringify(wallets)}</div>,
}))
vi.mock('@/components/dashboard/charts/investments-distribution', () => ({
  InvestmentDistribution: ({
    wallets,
  }: {
    wallets: {
      category: string
      deposited: number
      total: number
      notes: string
    }
  }) => (
    <div data-testid="investment-distribution">{JSON.stringify(wallets)}</div>
  ),
}))
vi.mock('@/components/dashboard/forms', () => ({
  FormsDasboard: () => <div data-testid="forms-dashboard" />,
}))
vi.mock('@/components/dashboard/headline', () => ({
  HeadLine: () => <div data-testid="headline" />,
}))

describe('Dashboard component', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should render Dashboard with data from getAnalytics and getBalance', async () => {
    const fakeAnalytics = {
      incomes: [{ value: 100, month: '2024-01', category: 'salary' }],
      expenses: [{ value: 50, month: '2024-01', category: 'food' }],
      patrimony: [{ value: 5000, month: '2024-01' }],
      wallets: [
        { category: 'stocks', month: '2024-01', total: 2000 },
        { category: 'crypto', month: '2024-01', total: 1000 },
      ],
    }
    const fakeBalance = {
      patrimony: 10000,
      investments: 6000,
    }

    ;(getAnalytics as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(
      fakeAnalytics,
    )
    ;(getBalance as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(
      fakeBalance,
    )

    const { findByTestId } = render(<Dashboard />)

    const patrimonyRange = await findByTestId('patrimony-range')
    const incomeExpenseRange = await findByTestId('income-expense-range')
    const investmentsPercentage = await findByTestId('investments-percentage')
    const investmentsRange = await findByTestId('investments-range')
    const investmentDistribution = await findByTestId('investment-distribution')
    const formsDashboard = await findByTestId('forms-dashboard')
    const headline = await findByTestId('headline')

    expect(patrimonyRange).toHaveTextContent(
      JSON.stringify(fakeAnalytics.patrimony),
    )
    expect(incomeExpenseRange).toHaveTextContent(
      JSON.stringify({
        incomes: fakeAnalytics.incomes,
        expenses: fakeAnalytics.expenses,
      }),
    )
    expect(investmentsPercentage).toHaveTextContent(
      `patrimony: ${fakeBalance.patrimony}`,
    )
    expect(investmentsPercentage).toHaveTextContent(
      `investments: ${fakeBalance.investments}`,
    )
    expect(investmentsRange).toHaveTextContent(
      JSON.stringify(fakeAnalytics.wallets),
    )
    expect(investmentDistribution).toHaveTextContent(
      JSON.stringify(fakeAnalytics.wallets),
    )
    expect(formsDashboard).toBeDefined()
    expect(headline).toBeDefined()
  })
})
