import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import request from 'supertest'
import { execSync } from 'child_process'
import { app } from '../src/app'

describe('Meals route', () => {
  beforeAll(() => {
    app.ready()
  })

  afterAll(() => {
    app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  it('should be able to list all meals of a user', async () => {
    // Create use
    const createUserResponse = await request(app.server).post('/users').send({
      name: 'Gustavo',
      email: 'gustavo@test.com',
    })

    const cookies = createUserResponse.get('Set-Cookie') ?? []

    // Create meal 1
    await request(app.server).post('/meals').set('Cookie', cookies).send({
      name: 'Meal 1',
      description: 'Description meal 1',
      dateTime: '1732548778',
      isWithinDiet: true,
    })

    // Create meal 2
    await request(app.server).post('/meals').set('Cookie', cookies).send({
      name: 'Meal 2',
      description: 'Description meal 2',
      dateTime: '1732548878',
      isWithinDiet: false,
    })

    // List meals
    const listMealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)

    expect(listMealsResponse.statusCode).toEqual(200)
    expect(listMealsResponse.body).toEqual({
      meals: [
        expect.objectContaining({
          name: 'Meal 1',
          description: 'Description meal 1',
          date_time: 1732548778,
          is_within_diet: 1,
        }),
        expect.objectContaining({
          name: 'Meal 2',
          description: 'Description meal 2',
          date_time: 1732548878,
          is_within_diet: 0,
        }),
      ],
    })
  })
})
