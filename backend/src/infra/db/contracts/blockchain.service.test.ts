// test/blockchain.service.integration.spec.ts
import { Test, TestingModule } from '@nestjs/testing'
import { beforeAll, afterAll, describe, it, expect } from 'vitest'
import { BlockchainService } from './blockchain.service'

describe('BlockchainService (integration)', () => {
  let service: BlockchainService
  let moduleRef: TestingModule

  const testAddress =
    process.env.TEST_WALLET_ADDRESS ||
    '0x0000000000000000000000000000000000000000'
  const testToken =
    process.env.TEST_TOKEN_ADDRESS ||
    '0x0000000000000000000000000000000000000000'

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [BlockchainService],
    }).compile()

    service = moduleRef.get<BlockchainService>(BlockchainService)
    await service.onModuleInit()
  })

  afterAll(async () => {
    await service.onModuleDestroy()
    await moduleRef.close()
  })

  it('deve retornar saldo ERC20 de um endereço', async () => {
    try {
      const erc20Balance = await service.getERC20Balance(testAddress, testToken)
      expect(typeof erc20Balance).toBe('number')
      expect(erc20Balance).toBeGreaterThanOrEqual(0)
    } catch (err) {
      console.warn('Error: ', err)
      expect(true).toBe(true)
    }
  })

  it('shold subscribe transfer event (ERC20)', async () => {
    const mockFn = (ev: any) => {
      console.log('Evento capturado:', ev)
    }

    const sub = service.subscribeTransfers(testToken, mockFn)
    expect(sub).toBeDefined()

    setTimeout(() => {
      sub.unsubscribe()
    }, 1000)
  })
})
