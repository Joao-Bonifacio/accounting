'use client'
import { TrendingUp } from 'lucide-react'
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { mergeIncomesAndExpenses } from '@/utils/analytics'

export const description = 'Income and Expense Range Chart'

const chartConfig = {
  incomes: {
    label: 'Incomes',
    color: 'var(--chart-1)',
  },
  expenses: {
    label: 'Expenses',
    color: 'var(--chart-2)',
  },
} satisfies ChartConfig

type IncomeExpense = {
  month: string
  value: number
  category: string
}
type IncomeExpenseRangeProps = {
  incomes: IncomeExpense[]
  expenses: IncomeExpense[]
}

export function IncomeExpenseRange({
  incomes,
  expenses,
}: IncomeExpenseRangeProps) {
  const chartData = mergeIncomesAndExpenses(incomes, expenses)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Incomes / Expenses range</CardTitle>
        <CardDescription>
          Showing total incomes and expenses (finance health)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="incomes"
              type="natural"
              fill="var(--color-incomes)"
              fillOpacity={0.4}
              stroke="var(--color-incomes)"
              stackId="a"
            />
            <Area
              dataKey="expenses"
              type="natural"
              fill="var(--color-expenses)"
              fillOpacity={0.4}
              stroke="var(--color-expenses)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 leading-none font-medium">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="text-muted-foreground flex items-center gap-2 leading-none">
              January - June {new Date().getFullYear()}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
