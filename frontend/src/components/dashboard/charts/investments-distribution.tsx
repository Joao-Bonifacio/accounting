'use client'

import { Cell, Pie, PieChart } from 'recharts'
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
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart'
import { transformWalletsToPieData } from '@/utils/analytics'
import { TrendingUp } from 'lucide-react'

export const description = 'Investments distribution'

// Gera o config com base nas categorias únicas
function generatePieChartConfig(data: { category: string }[]): ChartConfig {
  const colors = [
    'var(--chart-1)',
    'var(--chart-2)',
    'var(--chart-3)',
    'var(--chart-4)',
    'var(--chart-5)',
    'var(--chart-6)',
  ]

  return data.reduce((acc, { category }, index) => {
    acc[category] = {
      label: category,
      color: colors[index % colors.length],
    }
    return acc
  }, {} as ChartConfig)
}

export function InvestmentDistribution({
  wallets,
}: {
  wallets: { category: string; month: string; total: number }[]
}) {
  const chartData = transformWalletsToPieData(wallets)
  const chartConfig = generatePieChartConfig(chartData)

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Investment Distribution</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
            <Pie
              data={chartData}
              dataKey="total"
              nameKey="category"
              outerRadius="80%"
              innerRadius="50%"
              paddingAngle={2}
            >
              {chartData.map((entry) => (
                <Cell
                  key={entry.category}
                  fill={chartConfig[entry.category]?.color ?? 'var(--chart-1)'}
                />
              ))}
            </Pie>
            <ChartLegend
              content={<ChartLegendContent nameKey="category" />}
              className="-translate-y-2 flex-wrap justify-center gap-x-4 gap-y-1 text-xs"
            />
          </PieChart>
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
