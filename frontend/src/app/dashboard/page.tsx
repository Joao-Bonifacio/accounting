import { getAnalytics } from '@/api/analytics'
import { InvestmentDistribution } from '@/components/dashboard/charts/investments-distribution'
import { IncomeExpenseRange } from '@/components/dashboard/charts/Income-expence-range'
import { InvestmentsPercentage } from '@/components/dashboard/charts/investments-percentage'
import { InvestmentsRange } from '@/components/dashboard/charts/Investments-range'
import { PatrimonyRange } from '@/components/dashboard/charts/patrimony-range'
import { FormsDasboard } from '@/components/dashboard/forms'
import { HeadLine } from '@/components/dashboard/headline'
import { getBalance } from '@/api/finance'

export default async function Dashboard() {
  const { incomes, expenses, patrimony, wallets } = await getAnalytics()
  const { patrimony: patrimonyBalance, investments } = await getBalance()

  return (
    <div className="space-y-6 px-6 py-4 min-h-[84vh]">
      <HeadLine />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <FormsDasboard />
        <PatrimonyRange patrimony={patrimony} />
        <IncomeExpenseRange incomes={incomes} expenses={expenses} />
        <InvestmentsPercentage
          patrimony={patrimonyBalance}
          investments={investments}
        />
        <InvestmentsRange wallets={wallets} />
        <InvestmentDistribution wallets={wallets} />
      </div>
    </div>
  )
}
