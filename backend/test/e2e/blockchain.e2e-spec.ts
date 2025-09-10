import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { AppModule } from '@/infra/app.module'
import { describe, it, beforeAll, afterAll, expect } from 'vitest'

describe('App E2E (Blockchain)', () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  it('GET /blockchain/balance shold return ETH and ERC20 balance', async () => {
    const res = await request(app.getHttpServer())
      .get('/blockchain/balance?address=' + process.env.ACCOUNT_ADDRESS)
      .expect(200)

    expect(res.body).toHaveProperty('address')
    expect(res.body).toHaveProperty('ethBalance')
    expect(res.body).toHaveProperty('erc20Balance')
  })
})
