import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'

describe('Profile (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get user profile', async () => {
    const name = 'Test 01'
    const email = 'test01@test.com'
    const password = '123456'

    await request(app.server).post('/users').send({
      name,
      email,
      password,
    })

    const authenticationResponse = await request(app.server)
      .post('/sessions')
      .send({
        email,
        password,
      })

    const { token } = authenticationResponse.body

    const response = await request(app.server)
      .get('/me')
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toEqual(200)
    expect(response.body).toEqual({
      user: expect.objectContaining({
        name,
        email,
      }),
    })
  })
})
