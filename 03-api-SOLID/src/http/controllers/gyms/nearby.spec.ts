import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { createGym } from '@/utils/test/create-gym'

describe('Nearby gyms (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get nearby gyms', async () => {
    const name = 'Test 01'
    const email = 'test01@test.com'
    const password = '123456'

    const { token } = await createAndAuthenticateUser(
      app,
      {
        name,
        email,
        password,
      },
      true,
    )

    await createGym(app, token, {
      name: 'Gym 01',
      description: null,
      phone: null,
      latitude: 0,
      longitude: 0,
    })

    await createGym(app, token, {
      name: 'Gym 02',
      description: null,
      phone: null,
      latitude: 20,
      longitude: 20,
    })

    const response = await request(app.server)
      .get('/gyms/nearby')
      .query({
        latitude: 0.05,
        longitude: 0.05,
      })
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toEqual(200)
    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        name: 'Gym 01',
      }),
    ])
  })
})
