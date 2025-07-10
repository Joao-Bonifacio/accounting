import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getAnalytics } from '@/api/analytics'
import { api } from '@/api/api-wrapper'
import * as headers from 'next/headers'

vi.mock('@/api/api-wrapper', () => ({
  api: vi.fn(),
}))

vi.mock('next/headers', async () => {
  const original = await vi.importActual<typeof headers>('next/headers')
  return {
    ...original,
    cookies: vi.fn(() => ({
      get: vi.fn(() => ({ value: 'fake_token' })),
    })),
  }
})

const mockAnalytics = {
  id: '1',
  userId: 'user1',
  patrimony: [{ value: 1000, month: '2025-06' }],
  incomes: [{ value: 500, month: '2025-06', category: 'salary' }],
  expenses: [{ value: 300, month: '2025-06', category: 'rent' }],
  wallets: [],
  createdAt: new Date(),
  updatedAt: new Date(),
}

describe('getAnalytics', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return analytics data when token is present', async () => {
    const mockJson = vi.fn().mockResolvedValue(mockAnalytics)
    ;(api as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      json: mockJson,
    })

    const result = await getAnalytics()
    expect(result).toEqual(mockAnalytics)
  })

  it('should throw an error if no token is found', async () => {
    vi.mocked(headers.cookies).mockReturnValueOnce({
      get: () => undefined,
      getAll: () => [],
      has: () => false,
      [Symbol.iterator]: function* () {},
      size: 0,
    } as unknown as ReturnType<typeof headers.cookies>)

    await expect(getAnalytics()).rejects.toThrowError('Unauthorized')
  })

  it('should throw an error if analytics data is null', async () => {
    const mockJson = vi.fn().mockResolvedValue(null)
    ;(api as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      json: mockJson,
    })

    await expect(getAnalytics()).rejects.toThrowError(
      'Unable to get analytics.',
    )
  })
})
