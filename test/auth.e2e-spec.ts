import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from './../src/app.module'

describe('Authentication System', () => {
  let app: INestApplication

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  it('should handle the signin request', () => {
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: 'foo1@gmail.com', password: 'password' })
      .expect(201)
      .then((res) => {
        const { id, email } = res.body
        expect(id).toBeDefined()
        expect(email).toEqual('foo1@gmail.com')
      })
  })

  it('should handle the whoami request for logged in user', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({ email: 'foo1@gmail.com', password: 'password' })
      .expect(201)
    const cookie = res.get('Set-Cookie')
    const { body } = await request(app.getHttpServer())
      .get('/auth/whoami')
      .set('Cookie', cookie)
      .expect(200)
    expect(body.email).toEqual('foo1@gmail.com')
  })
})
