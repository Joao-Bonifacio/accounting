import { SessionController } from './session.controller'
import { UserStorage } from '@/infra/db/prisma/transactions/user.storage'
import { FinanceStorage } from '@/infra/db/prisma/transactions/finace.storage'
import { AnalyticsStorage } from '@/infra/db/prisma/transactions/analytics.storage'
import { HttpException, HttpStatus } from '@nestjs/common'
import {
  createMockUserStorage,
  MockedService,
} from '@/test/mocks/services.mock'
import { Level, Role } from '@/prisma/generated/postgres'

describe('SessionController', () => {
  let controller: SessionController
  let userStorage: MockedService<UserStorage>
  let financeStorage: MockedService<FinanceStorage>
  let analyticsStorage: MockedService<AnalyticsStorage>

  const mockUserPayload = {
    id: 'user-id-123',
    name: 'John Doe',
    email: 'john@example.com',
    nickname: 'johnny',
    password: 'hashed-password-string',
    level: Level.BRONZE,
    role: Role.USER,
    avatar: null,
  }

  beforeEach(() => {
    userStorage = createMockUserStorage()
    financeStorage = {
      create: vi.fn(),
      delete: vi.fn(),
      getBalance: vi.fn(),
      addIncome: vi.fn(),
      addExpense: vi.fn(),
      depositWallet: vi.fn(),
      withdrawWallet: vi.fn(),
    }
    analyticsStorage = {
      create: vi.fn(),
      delete: vi.fn(),
      updateAnalytics: vi.fn(),
      syncAnalytics: vi.fn(),
    }

    controller = new SessionController(
      userStorage as unknown as UserStorage,
      financeStorage as unknown as FinanceStorage,
      analyticsStorage as unknown as AnalyticsStorage,
    )
  })

  describe('sign-up (create)', () => {
    const signUpBody = {
      name: 'John Doe',
      email: 'john@example.com',
      nickname: 'johnny',
      password: 'a-secure-password',
    }

    it('should create a user and return an access token without the password', async () => {
      userStorage.create.mockResolvedValue({
        access_token: 'new-access-token',
        user: mockUserPayload,
      })

      const result = await controller.create(signUpBody)

      expect(userStorage.create).toHaveBeenCalledWith(signUpBody)
      expect(financeStorage.create).toHaveBeenCalledWith(mockUserPayload.id)
      expect(analyticsStorage.create).toHaveBeenCalledWith(mockUserPayload.id)
      expect(result.access_token).toBe('new-access-token')
      expect(result.user.password).toBeUndefined()
    })

    it('should throw HttpException when user creation fails', async () => {
      const errorResponse = { error: 'Invalid Credentials' as const }
      userStorage.create.mockResolvedValue(errorResponse)

      await expect(controller.create(signUpBody)).rejects.toThrow(
        new HttpException(errorResponse, HttpStatus.BAD_REQUEST),
      )
    })
  })

  describe('sign-in (match)', () => {
    const signInBody = {
      email: 'john@example.com',
      password: 'a-secure-password',
      nickname: undefined,
    }

    it('should log in a user and return an access token without the password', async () => {
      userStorage.find.mockResolvedValue({
        access_token: 'login-access-token',
        user: mockUserPayload,
      })

      const result = await controller.match(signInBody)

      expect(userStorage.find).toHaveBeenCalledWith(signInBody)
      expect(result.access_token).toBe('login-access-token')
      expect(result.user.password).toBeUndefined()
    })

    it('should throw HttpException for invalid credentials', async () => {
      const errorResponse = { error: 'Invalid Credentials' as const }
      userStorage.find.mockResolvedValue(errorResponse)

      await expect(controller.match(signInBody)).rejects.toThrow(
        new HttpException(errorResponse, HttpStatus.BAD_REQUEST),
      )
    })
  })

  describe('removeUser', () => {
    it('should call all delete methods with the correct user ID', async () => {
      const userContext = { sub: 'user-id-123', nickname: 'john_doe' }
      userStorage.delete.mockResolvedValue(undefined)
      financeStorage.delete.mockResolvedValue(undefined)
      analyticsStorage.delete.mockResolvedValue(undefined)

      await controller.removeUser(userContext)

      expect(financeStorage.delete).toHaveBeenCalledWith(userContext.sub)
      expect(analyticsStorage.delete).toHaveBeenCalledWith(userContext.sub)
      expect(userStorage.delete).toHaveBeenCalledWith(userContext.sub)
    })
  })
})
