import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  getBalance,
  addIncome,
  addExpense,
  depositWallet,
  withdrawWallet,
} from '@/api/finance'
import { api } from '@/api/api-wrapper'
import * as headers from 'next/headers'
import * as cache from 'next/cache'

vi.mock('@/api/api-wrapper', () => ({
  api: vi.fn(),
}))

vi.mock('next/headers', async () => {
  const original = await vi.importActual<typeof headers>('next/headers')
  return {
    ...original,
    cookies: vi.fn(() =>
      Promise.resolve({
        get: vi.fn(() => ({ value: 'fake_token' })),
      }),
    ),
  }
})

vi.mock('next/cache', () => ({
  revalidateTag: vi.fn(),
}))

vi.mock('@/api/validation/zod-validate', () => ({
  validate: vi.fn(() => ({ success: true })),
}))

const mockBalance = {
  patrimony: 10000,
  incomes: [],
  expenses: [],
  wallets: [],
}

describe('finance API server actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('getBalance: should return balance', async () => {
    const mockJson = vi.fn().mockResolvedValue(mockBalance)
    ;(api as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      json: mockJson,
    })

    const result = await getBalance()
    expect(result).toEqual(mockBalance)
    expect(api).toHaveBeenCalledWith('finance/balance', {
      method: 'GET',
      headers: {
        Authorization: 'Bearer fake_token',
      },
    })
  })

  it('addIncome: should call API and revalidate', async () => {
    const mockForm = new FormData()
    ;(api as ReturnType<typeof vi.fn>).mockResolvedValue({ ok: true })

    await addIncome(mockForm)

    expect(api).toHaveBeenCalled()
    expect(cache.revalidateTag).toHaveBeenCalledWith('balance')
  })

  it('addExpense: should call API and revalidate', async () => {
    const mockForm = new FormData()
    ;(api as ReturnType<typeof vi.fn>).mockResolvedValue({ ok: true })

    await addExpense(mockForm)

    expect(api).toHaveBeenCalled()
    expect(cache.revalidateTag).toHaveBeenCalledWith('balance')
  })

  it('depositWallet: should call API and revalidate', async () => {
    const mockForm = new FormData()
    ;(api as ReturnType<typeof vi.fn>).mockResolvedValue({ ok: true })

    await depositWallet(mockForm, 'savings')

    expect(api).toHaveBeenCalledWith(
      '/finance/wallet/deposit',
      expect.any(Object),
    )
    expect(cache.revalidateTag).toHaveBeenCalledWith('balance')
  })

  it('withdrawWallet: should call API and revalidate', async () => {
    const mockForm = new FormData()
    ;(api as ReturnType<typeof vi.fn>).mockResolvedValue({ ok: true })

    await withdrawWallet(mockForm, 'cash')

    expect(api).toHaveBeenCalledWith(
      '/finance/wallet/withdraw',
      expect.any(Object),
    )
    expect(cache.revalidateTag).toHaveBeenCalledWith('balance')
  })

  it('should throw error if no token is found', async () => {
    vi.mocked(headers.cookies).mockReturnValueOnce({
      get: () => undefined,
      getAll: () => [],
      has: () => false,
      [Symbol.iterator]: function* () {},
      size: 0,
    } as unknown as ReturnType<typeof headers.cookies>)

    await expect(getBalance()).rejects.toThrowError('Unauthorized')
  })

  it('should throw if validation fails', async () => {
    vi.mocked(headers.cookies).mockReturnValueOnce({
      get: () => undefined,
      getAll: () => [],
      has: () => false,
      [Symbol.iterator]: function* () {},
      size: 0,
    } as unknown as ReturnType<typeof headers.cookies>)

    await expect(addIncome(new FormData())).rejects.toThrowError('Unauthorized')
  })

  it('should throw if response is not ok', async () => {
    ;(api as ReturnType<typeof vi.fn>).mockResolvedValue({ ok: false })

    await expect(addExpense(new FormData())).rejects.toThrowError(
      'Unable to add expense.',
    )
  })
})
