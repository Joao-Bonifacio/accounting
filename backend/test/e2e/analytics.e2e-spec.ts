import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from '@/infra/app.module'
import { JwtService } from '@nestjs/jwt'

describe('AnalyticsController (e2e)', () => {
  let app: INestApplication
  let accessToken: string
  const userId = 'user-123'

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }))
    await app.init()

    const jwtService = moduleFixture.get(JwtService)
    accessToken = jwtService.sign({ sub: userId })
  })

  it('/analytics (GET) returns 200 and analytics', async () => {
    const res = await request(app.getHttpServer())
      .get('/analytics')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)

    expect(res.body).toHaveProperty('wallets')
    expect(res.body).toHaveProperty('incomes')
  })

  afterAll(async () => {
    await app.close()
  })
})
