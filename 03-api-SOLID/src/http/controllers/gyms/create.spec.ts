import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { createGym } from '@/utils/test/create-gym'

describe('Create gym (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a gym', async () => {
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

    const response = await createGym(app, token, {
      name: 'Gym 01',
      description: null,
      phone: null,
      latitude: 0,
      longitude: 0,
    })

    expect(response.status).toEqual(201)
  })
})
