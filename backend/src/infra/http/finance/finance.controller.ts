import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  UsePipes,
} from '@nestjs/common'
import { FinanceService } from './finance.service'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import type { UserPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidatorPipe } from '@/infra/pipes/zod-validation.pipe'
import {
  type ExpenseDTO,
  type IncomeDTO,
  zExpenseDTO,
  zIncomeDTO,
} from './finance.dto'

@Controller('finance')
export class FinanceController {
  constructor(private finance: FinanceService) {}

  @Get('balance')
  async getBalance(@CurrentUser() { sub }: UserPayload) {
    return this.finance.getBalance(sub)
  }

  @Patch('income')
  @HttpCode(204)
  @UsePipes(new ZodValidatorPipe(zIncomeDTO))
  async addIncome(
    @CurrentUser() { sub }: UserPayload,
    @Body() body: IncomeDTO,
  ) {
    return this.finance.addIncome(sub, body)
  }

  @Patch('expense')
  @HttpCode(204)
  @UsePipes(new ZodValidatorPipe(zExpenseDTO))
  async addExpense(
    @CurrentUser() { sub }: UserPayload,
    @Body() body: ExpenseDTO,
  ) {
    return this.finance.addExpense(sub, body)
  }

  @Patch('wallet/deposit')
  @HttpCode(204)
  async depositWallet(
    @CurrentUser() { sub }: UserPayload,
    @Body() body: { value: number; category: string; notes?: string },
  ) {
    return this.finance.depositWallet(sub, body)
  }

  @Patch('wallet/withdraw/:category')
  @HttpCode(204)
  async withdrawWallet(
    @CurrentUser() { sub }: UserPayload,
    @Param('category') category: string,
    @Body() body: { value: number },
  ) {
    return this.finance.withdrawWallet(sub, category, body.value)
  }
}
