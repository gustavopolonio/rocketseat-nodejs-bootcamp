import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { prisma } from '@/lib/prisma'
import { createGym } from '@/utils/test/create-gym'

describe('Create check-in (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a check-in', async () => {
    const name = 'Test 01'
    const email = 'test01@test.com'
    const password = '123456'

    const { token } = await createAndAuthenticateUser(app, {
      name,
      email,
      password,
    })

    await createGym(app, token, {
      name: 'Gym 01',
      description: null,
      phone: null,
      latitude: 0,
      longitude: 0,
    })

    const gym = await prisma.gym.findFirstOrThrow({
      where: {
        name: 'Gym 01',
      },
    })

    const response = await request(app.server)
      .post(`/gyms/${gym.id}/check-ins`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        userLatitude: 0,
        userLongitude: 0,
      })

    expect(response.status).toEqual(201)
  })
})
