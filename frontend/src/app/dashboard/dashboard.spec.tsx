import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import DashboardClient from '@/app/dashboard/dashboard-client'

describe('DashboardClient component', () => {
  it('should render all child components passed to it', () => {
    const { getByTestId } = render(
      <DashboardClient>
        <div data-testid="patrimony-range">Patrimony</div>
        <div data-testid="income-expense-range">IncomeExpense</div>
        <div data-testid="investments-percentage">Percentage</div>
        <div data-testid="investments-range">Range</div>
        <div data-testid="investment-distribution">Distribution</div>
        <div data-testid="forms-dashboard">Forms</div>
        <div data-testid="headline">Headline</div>
      </DashboardClient>,
    )

    expect(getByTestId('patrimony-range')).toBeInTheDocument()
    expect(getByTestId('income-expense-range')).toBeInTheDocument()
    expect(getByTestId('investments-percentage')).toBeInTheDocument()
    expect(getByTestId('investments-range')).toBeInTheDocument()
    expect(getByTestId('investment-distribution')).toBeInTheDocument()
    expect(getByTestId('forms-dashboard')).toBeInTheDocument()
    expect(getByTestId('headline')).toBeInTheDocument()
  })
})
