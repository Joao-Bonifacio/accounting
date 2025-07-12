import { describe, it, beforeAll, afterAll } from 'vitest'
import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import request from 'supertest'
import { JwtService } from '@nestjs/jwt'
import { AppModule } from '@/infra/app.module'

describe('FinanceController (e2e)', () => {
  let app: INestApplication
  let jwtService: JwtService
  let accessToken: string
  const sub = 'user-e2e-id'
  const nickname = 'test_user2'

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }))
    await app.init()

    jwtService = moduleFixture.get(JwtService)
    accessToken = jwtService.sign({ sub, nickname })
  })

  it('/finance/balance (GET) should return user balance', async () => {
    const res = await request(app.getHttpServer())
      .get('/finance/balance')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)

    expect(res.body).toHaveProperty('wallets')
  })

  it('/finance/income (PATCH) should add income', async () => {
    await request(app.getHttpServer())
      .patch('/finance/income')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ value: 100, category: 'salary', month: '2025-07' })
      .expect(204)
  })

  it('/finance/expense (PATCH) should add expense', async () => {
    await request(app.getHttpServer())
      .patch('/finance/expense')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ value: 50, category: 'rent', month: '2025-07' })
      .expect(204)
  })

  it('/finance/wallet/deposit (PATCH)', async () => {
    await request(app.getHttpServer())
      .patch('/finance/wallet/deposit')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ category: 'stoks', value: 200 })
      .expect(204)
  })

  it('/finance/wallet/withdraw (PATCH)', async () => {
    await request(app.getHttpServer())
      .patch('/finance/wallet/withdraw')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ category: 'stoks', value: 100 })
      .expect(204)
  })

  afterAll(async () => {
    await app.close()
  })
})
