import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import request from 'supertest'
import { execSync } from 'child_process'
import { app } from '../src/app'
import { randomUUID } from 'crypto'

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
          name: 'Meal 2',
          description: 'Description meal 2',
          date_time: 1732548878,
          is_within_diet: 0,
        }),
        expect.objectContaining({
          name: 'Meal 1',
          description: 'Description meal 1',
          date_time: 1732548778,
          is_within_diet: 1,
        }),
      ],
    })
  })

  it('should be able to get a specific meal', async () => {
    // Create user
    const createUserResponse = await request(app.server).post('/users').send({
      name: 'Gustavo',
      email: 'gustavo@test.com',
    })

    const cookies = createUserResponse.get('Set-Cookie') ?? []

    // Create meal
    const createMealResponse = await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Meal 1',
        description: 'Description meal 1',
        dateTime: '1732548778',
        isWithinDiet: true,
      })

    const mealId = createMealResponse.body.meal.id

    // Get meal
    const getMealResponse = await request(app.server)
      .get(`/meals/${mealId}`)
      .set('Cookie', cookies)

    expect(getMealResponse.statusCode).toEqual(200)
    expect(getMealResponse.body).toEqual({
      meal: expect.objectContaining({
        name: 'Meal 1',
        description: 'Description meal 1',
        date_time: 1732548778,
        is_within_diet: 1,
      }),
    })
  })

  it('should not be able to get an unexisting meal', async () => {
    // Create user
    const createUserResponse = await request(app.server).post('/users').send({
      name: 'Gustavo',
      email: 'gustavo@test.com',
    })

    const cookies = createUserResponse.get('Set-Cookie') ?? []
    const mealId = randomUUID()

    const getMealResponse = await request(app.server)
      .get(`/meals/${mealId}`)
      .set('Cookie', cookies)

    expect(getMealResponse.statusCode).toEqual(404)
    expect(getMealResponse.body.error).toEqual('Meal not found')
  })

  it('should be able to get user metrics', async () => {
    // Create user
    const createUserResponse = await request(app.server).post('/users').send({
      name: 'Gustavo',
      email: 'gustavo@test.com',
    })

    const cookies = createUserResponse.get('Set-Cookie') ?? []

    // Create meal 1 (onDiet)
    await request(app.server).post('/meals').set('Cookie', cookies).send({
      name: 'Meal 1',
      description: 'Description meal 1',
      dateTime: '1732548178',
      isWithinDiet: true,
    })

    // Create meal 2 (onDiet)
    await request(app.server).post('/meals').set('Cookie', cookies).send({
      name: 'Meal 2',
      description: 'Description meal 2',
      dateTime: '1732548878',
      isWithinDiet: true,
    })

    // Create meal 3 (offDiet)
    await request(app.server).post('/meals').set('Cookie', cookies).send({
      name: 'Meal 3',
      description: 'Description meal 3',
      dateTime: '1732548578',
      isWithinDiet: false,
    })

    const getUserMetricsResponse = await request(app.server)
      .get('/meals/metrics')
      .set('Cookie', cookies)

    expect(getUserMetricsResponse.statusCode).toEqual(200)
    expect(getUserMetricsResponse.body).toEqual({
      metrics: {
        totalMeals: 3,
        totalMealsOnDiet: 2,
        totalMealsOffDiet: 1,
        bestStreak: 1,
      },
    })
  })

  it('should be able to create a meal', async () => {
    // Create user
    const createUserResponse = await request(app.server).post('/users').send({
      name: 'Gustavo',
      email: 'gustavo@test.com',
    })

    const cookies = createUserResponse.get('Set-Cookie') ?? []

    // Create meal
    const createMealResponse = await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Meal 1',
        description: 'Description meal 1',
        dateTime: '1732548178',
        isWithinDiet: true,
      })

    expect(createMealResponse.statusCode).toEqual(201)
  })

  it('should be able to edit a meal', async () => {
    // Create user
    const createUserResponse = await request(app.server).post('/users').send({
      name: 'Gustavo',
      email: 'gustavo@test.com',
    })

    const cookies = createUserResponse.get('Set-Cookie') ?? []

    // Create meal
    const createMealResponse = await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Meal 1',
        description: 'Description meal 1',
        dateTime: '1732548178',
        isWithinDiet: true,
      })

    const mealId = createMealResponse.body.meal.id

    // Update meal
    const updateMealResponse = await request(app.server)
      .put(`/meals/${mealId}`)
      .set('Cookie', cookies)
      .send({
        name: 'Meal 1 - updated',
        description: 'Description meal 1',
        dateTime: '1732548178',
        isWithinDiet: false,
      })

    expect(updateMealResponse.statusCode).toEqual(204)
  })

  it('should not be able to edit an unexisting meal', async () => {
    // Create user
    const createUserResponse = await request(app.server).post('/users').send({
      name: 'Gustavo',
      email: 'gustavo@test.com',
    })

    const cookies = createUserResponse.get('Set-Cookie') ?? []

    const mealId = randomUUID()

    // Update meal
    const updateMealResponse = await request(app.server)
      .put(`/meals/${mealId}`)
      .set('Cookie', cookies)
      .send({
        name: 'Meal 1 - updated',
        description: 'Description meal 1',
        dateTime: '1732548178',
        isWithinDiet: false,
      })

    expect(updateMealResponse.statusCode).toEqual(404)
    expect(updateMealResponse.body.error).toEqual('Meal not found')
  })

  it('should be able to delete a meal', async () => {
    // Create user
    const createUserResponse = await request(app.server).post('/users').send({
      name: 'Gustavo',
      email: 'gustavo@test.com',
    })

    const cookies = createUserResponse.get('Set-Cookie') ?? []

    // Create meal
    const createMealResponse = await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Meal 1',
        description: 'Description meal 1',
        dateTime: '1732548178',
        isWithinDiet: true,
      })

    const mealId = createMealResponse.body.meal.id

    // Delete meal
    const deleteMealResponse = await request(app.server)
      .delete(`/meals/${mealId}`)
      .set('Cookie', cookies)

    expect(deleteMealResponse.statusCode).toEqual(204)
  })

  it('should not be able to delete an unexisting meal', async () => {
    // Create user
    const createUserResponse = await request(app.server).post('/users').send({
      name: 'Gustavo',
      email: 'gustavo@test.com',
    })

    const cookies = createUserResponse.get('Set-Cookie') ?? []
    const mealId = randomUUID()

    // Delete meal
    const deleteMealResponse = await request(app.server)
      .delete(`/meals/${mealId}`)
      .set('Cookie', cookies)

    expect(deleteMealResponse.statusCode).toEqual(404)
    expect(deleteMealResponse.body.error).toEqual('Meal not found')
  })
})
