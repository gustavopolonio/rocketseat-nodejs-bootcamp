import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { prisma } from '@/lib/prisma'
import { createGym } from '@/utils/test/create-gym'

describe('History check-in (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get user check-ins history', async () => {
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

    const user = await prisma.user.findFirstOrThrow({
      where: {
        name,
      },
    })

    const gym = await prisma.gym.findFirstOrThrow({
      where: {
        name: 'Gym 01',
      },
    })

    await prisma.checkIn.createMany({
      data: [
        {
          user_id: user.id,
          gym_id: gym.id,
        },
        {
          user_id: user.id,
          gym_id: gym.id,
        },
      ],
    })

    const response = await request(app.server)
      .get('/check-ins/history')
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toEqual(200)
    expect(response.body.checkIns).toHaveLength(2)
    expect(response.body.checkIns).toEqual([
      expect.objectContaining({
        user_id: user.id,
        gym_id: gym.id,
      }),
      expect.objectContaining({
        user_id: user.id,
        gym_id: gym.id,
      }),
    ])
  })
})
