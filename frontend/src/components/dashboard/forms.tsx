/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  addExpense,
  addIncome,
  depositWallet,
  withdrawWallet,
} from '@/api/finance'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Input } from '../ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { DateHourPicker } from './date-hour-picker'

export function FormsDasboard() {
  return (
    <Accordion
      type="single"
      collapsible
      className="w-full"
      defaultValue="item-1"
    >
      <AccordionItem value="item-1">
        <AccordionTrigger className="cursor-pointer">
          Income / Expense
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 text-balance">
          <IncomeExpenseForm />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger className="cursor-pointer">
          Investment
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 text-balance">
          <InvestmentForm />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger className="cursor-pointer">Debt</AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 text-balance">
          <DebtForm />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

function IncomeExpenseForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Income / Expense</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <Select name="type">
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="income">Income</SelectItem>
            <SelectItem value="expense">Expense</SelectItem>
          </SelectContent>
        </Select>
        <form
          action={async (data: FormData) => {
            'use server'
            if (data.get('type') === 'income') {
              data.set('type', undefined as any)
              await addIncome(data)
            }
            data.set('type', undefined as any)
            await addExpense(data)
          }}
          className="space-y-2"
        >
          <Input type="text" name="category" placeholder="Category" />
          <Input type="number" name="value" placeholder="Value" />
          <DateHourPicker name="date" />
          <Button className="w-full">Submit</Button>
        </form>
      </CardContent>
    </Card>
  )
}

function InvestmentForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Deposit / Withdraw Investment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <Select name="type">
          <SelectTrigger>
            <SelectValue placeholder="Select action" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="deposit">Deposit</SelectItem>
            <SelectItem value="withdraw">Withdraw</SelectItem>
          </SelectContent>
        </Select>
        <form
          action={async (data: FormData) => {
            'use server'
            if (data.get('type') === 'deposit') {
              data.set('type', undefined as any)
              await depositWallet(data, data.get('category') as string)
            }
            data.set('type', undefined as any)
            await withdrawWallet(data, data.get('category') as string)
          }}
          className="space-y-5"
        >
          <Input type="text" name="category" placeholder="Category" />
          <Input type="number" placeholder="Value" />
          <DateHourPicker name="date" />
          <Button className="w-full">Submit</Button>
        </form>
      </CardContent>
    </Card>
  )
}

function DebtForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Add / Pay Debt</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <Select name="type">
          <SelectTrigger>
            <SelectValue placeholder="Select action" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="add">Add</SelectItem>
            <SelectItem value="pay">Pay</SelectItem>
          </SelectContent>
        </Select>
        <form
          action={async (data: FormData) => {
            'use server'
            if (data.get('type') === 'add') {
              data.set('type', undefined as any)
              // await addDebt(data)
            }
            data.set('type', undefined as any)
            // await payDebt(data)
          }}
          className="space-y-5"
        >
          <Input type="text" placeholder="Category" />
          <Input type="number" placeholder="Value" />
          <DateHourPicker name="date" />
          <Button className="w-full">Submit</Button>
        </form>
      </CardContent>
    </Card>
  )
}
