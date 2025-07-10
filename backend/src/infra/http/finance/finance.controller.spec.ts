import { Test, TestingModule } from '@nestjs/testing'
import { FinanceController } from './finance.controller'
import { FinanceService } from './finance.service'

describe('FinanceController', () => {
  let controller: FinanceController
  let financeService: FinanceService

  const userPayload = { sub: 'user-id-123', nickname: 'john_dee' }

  const mockFinanceService = {
    getBalance: vi.fn(),
    addIncome: vi.fn(),
    addExpense: vi.fn(),
    depositWallet: vi.fn(),
    withdrawWallet: vi.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FinanceController],
      providers: [
        {
          provide: FinanceService,
          useValue: mockFinanceService,
        },
      ],
    }).compile()

    controller = module.get(FinanceController)
    financeService = module.get(FinanceService)
  })

  it('should return balance', async () => {
    const mockBalance = { incomes: [], expenses: [], wallets: [] }
    mockFinanceService.getBalance.mockResolvedValue(mockBalance)

    const result = await controller.getBalance(userPayload)
    expect(result).toEqual(mockBalance)
    expect(financeService.getBalance).toHaveBeenCalledWith(userPayload.sub)
  })

  it('should call addIncome with correct payload', async () => {
    const income = { value: 100, category: 'salary', month: '2025-07' }
    await controller.addIncome(userPayload, income)

    expect(financeService.addIncome).toHaveBeenCalledWith(userPayload.sub, income)
  })

  it('should call addExpense with correct payload', async () => {
    const expense = { value: 50, category: 'rent', month: '2025-07' }
    await controller.addExpense(userPayload, expense)

    expect(financeService.addExpense).toHaveBeenCalledWith(userPayload.sub, expense)
  })

  it('should call depositWallet', async () => {
    const body = { value: 300, category: 'savings', notes: 'monthly deposit' }
    await controller.depositWallet(userPayload, body)

    expect(financeService.depositWallet).toHaveBeenCalledWith(
      userPayload.sub,
      'savings',
      300
    )
  })

  it('should call withdrawWallet with correct params', async () => {
    const body = { value: 200 }
    await controller.withdrawWallet(userPayload, 'bank', body)

    expect(financeService.withdrawWallet).toHaveBeenCalledWith(
      userPayload.sub,
      'bank',
      200
    )
  })
})
