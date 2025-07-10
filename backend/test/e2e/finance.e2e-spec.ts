import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import * as request from 'supertest'
import { JwtService } from '@nestjs/jwt'
import { AppModule } from '@/infra/app.module'

describe('FinanceController (e2e)', () => {
  let app: INestApplication
  let jwtService: JwtService
  let accessToken: string
  const userId = 'user-e2e-id'

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }))
    await app.init()

    jwtService = moduleFixture.get(JwtService)
    accessToken = jwtService.sign({ sub: userId })
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

  it('/finance/wallet/deposit/:category (PATCH)', async () => {
    await request(app.getHttpServer())
      .patch('/finance/wallet/deposit/savings')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ value: 200 })
      .expect(204)
  })

  it('/finance/wallet/withdraw/:category (PATCH)', async () => {
    await request(app.getHttpServer())
      .patch('/finance/wallet/withdraw/savings')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ value: 100 })
      .expect(204)
  })

  afterAll(async () => {
    await app.close()
  })
})
