import { Test, TestingModule } from '@nestjs/testing'
import { describe, it, expect, beforeAll, vi } from 'vitest'
import { BlockchainStorage } from './blockchain.storage'
import { BlockchainService } from '../blockchain.service'

describe('BlockchainStorage (integração)', () => {
  let storage: BlockchainStorage
  let service: BlockchainService

  const mockBlockchainService = {
    getBalance: vi.fn().mockResolvedValue('5.0'),
    getERC20Balance: vi.fn().mockResolvedValue(100),
  }

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BlockchainStorage,
        { provide: BlockchainService, useValue: mockBlockchainService },
      ],
    }).compile()

    storage = module.get<BlockchainStorage>(BlockchainStorage)
    service = module.get<BlockchainService>(BlockchainService)
  })

  it('deve retornar saldo ETH chamando BlockchainService', async () => {
    const balance = await storage.getBalance('0xTEST')
    expect(balance).toBe('5.0')
    expect(service.getBalance).toHaveBeenCalledWith('0xTEST')
  })

  it('deve retornar saldo ERC20 chamando BlockchainService', async () => {
    const balance = await storage.getERC20Balance('0xTEST', '0xTOKEN')
    expect(balance).toBe(100)
    expect(service.getERC20Balance).toHaveBeenCalledWith('0xTEST', '0xTOKEN')
  })
})
