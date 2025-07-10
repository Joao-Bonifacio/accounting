import { getBalance } from '@/api/finance'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'

type BalanceKey =
  | 'cash'
  | 'incomes'
  | 'expenses'
  | 'investments'
  | 'patrimony'
  | 'debts'

const items: { label: string; key: BalanceKey; icon: string; color: string }[] =
  [
    { label: 'Cash', key: 'cash', icon: '💰', color: 'text-green-600' },
    { label: 'Incomes', key: 'incomes', icon: '⬆️', color: 'text-emerald-500' },
    { label: 'Expenses', key: 'expenses', icon: '⬇️', color: 'text-red-500' },
    {
      label: 'Investments',
      key: 'investments',
      icon: '📈',
      color: 'text-indigo-500',
    },
    {
      label: 'Patrimony',
      key: 'patrimony',
      icon: '📊',
      color: 'text-blue-600',
    },
    { label: 'Debts', key: 'debts', icon: '💸', color: 'text-orange-500' },
  ]

export async function HeadLine() {
  const { cash, investments, incomes, expenses, patrimony, debts } =
    await getBalance()

  const totalIncomes = incomes.reduce((sum, income) => sum + income.value, 0)
  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.value,
    0,
  )

  const data = {
    cash,
    incomes: totalIncomes,
    expenses: totalExpenses,
    investments,
    patrimony,
    debts,
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {items.map(({ label, key, icon, color }) => (
        <Card key={key} className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-md font-medium">{label}</CardTitle>
            <div className="text-2xl">{icon}</div>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${color}`}>
              $ {data[key].toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">Updated</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
