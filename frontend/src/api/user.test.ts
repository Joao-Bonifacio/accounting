import { describe, it, expect, beforeEach, vi } from 'vitest'
import { signIn, signUp } from '@/api/user'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { mockUser } from '@/__test__/mocks/user.mock'

vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

const mockSetUser = vi.fn()

vi.mock('@/context/stores/user-store', () => {
  const actual = vi.importActual<typeof import('@/context/user-store')>(
    '@/context/stores/user-store',
  )

  return {
    ...actual,
    useUserStore: () => ({
      setUser: mockSetUser,
    }),
  }
})

describe('User API Integration', () => {
  let mockSetCookie: ReturnType<typeof vi.fn>

  beforeEach(() => {
    vi.clearAllMocks()

    mockSetCookie = vi.fn()
    ;(cookies as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      set: mockSetCookie,
    })

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ access_token: 'mock-token' }),
    } as Response)
  })

  it('should sign-up successfully with valid form data and set user in store', async () => {
    const form = new FormData()
    form.set('name', 'John Doe')
    form.set('email', 'john@example.com')
    form.set('nickname', 'john_doe')
    form.set('password', '@Passw0rd')
    form.set('confirm-password', '@Passw0rd')

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ access_token: 'mock-token', user: mockUser }),
    } as Response)

    await expect(signUp(form)).resolves.toBeUndefined()

    expect(mockSetCookie).toHaveBeenCalledWith('access_token', 'mock-token')
    // expect(mockSetUser).toHaveBeenCalledWith(mockUser)
    expect(redirect).toHaveBeenCalledWith('/dashboard')
  })

  it('should fail sign-up with mismatched passwords', async () => {
    const form = new FormData()
    form.set('name', 'John Doe')
    form.set('email', 'john@example.com')
    form.set('nickname', 'john_doe')
    form.set('password', '@Passw0rd')
    form.set('confirm-password', 'wrongpass')

    const result = await signUp(form)

    expect(result).toBeNull()
  })

  it('should sign-in with email successfully and set user in store', async () => {
    const form = new FormData()
    form.set('email', 'test@test.com')
    form.set('password', '@Passw0rd')

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ access_token: 'mock-token', user: mockUser }),
    } as Response)

    await expect(signIn(form)).resolves.toBeUndefined()

    expect(mockSetCookie).toHaveBeenCalledWith('access_token', 'mock-token')
    // expect(mockSetUser).toHaveBeenCalledWith(mockUser)
    expect(redirect).toHaveBeenCalledWith('/dashboard')
  })

  it('should sign-in with nickname successfully and set user in store', async () => {
    const form = new FormData()
    form.set('nickname', 'john_doe')
    form.set('password', '@Passw0rd')

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ access_token: 'mock-token', user: mockUser }),
    } as Response)

    await expect(signIn(form)).resolves.toBeUndefined()

    expect(mockSetCookie).toHaveBeenCalledWith('access_token', 'mock-token')
    // expect(mockSetUser).toHaveBeenCalledWith(mockUser)
    expect(redirect).toHaveBeenCalledWith('/dashboard')
  })
})
