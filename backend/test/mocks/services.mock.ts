import type { Mock } from 'vitest'
import { UserStorage } from '@/infra/db/prisma/transactions/user.storage'
import { S3Storage } from '@/infra/db/image/s3.service'
import { CacheStorage } from '@/infra/db/cache/cache.service'

// A generic type for a mocked service
export type MockedService<T> = {
  [K in keyof T]: T[K] extends (...args: any) => any ? Mock<T[K]> : T[K]
}

export const createMockUserStorage = (): MockedService<UserStorage> => ({
  find: vi.fn(),
  findById: vi.fn(),
  create: vi.fn(),
  delete: vi.fn(),
  updatePassword: vi.fn(),
  updateAvatar: vi.fn(),
  findByNick: vi.fn(),
})

export const createMockS3Storage = (): MockedService<S3Storage> => ({
  upload: vi.fn(),
  delete: vi.fn(),
})

export const createMockCacheStorage = (): MockedService<CacheStorage> =>
  ({
    get: vi.fn(),
    set: vi.fn(),
    setex: vi.fn(),
    del: vi.fn(),
  }) as Partial<MockedService<CacheStorage>> as MockedService<CacheStorage>
