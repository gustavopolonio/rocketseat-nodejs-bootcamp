import { afterAll, beforeAll, expect, test } from 'vitest'
import supertest from 'supertest'
import { app } from '../src/app'

beforeAll(async () => {
  await app.ready()
})

afterAll(async () => {
  await app.close()
})

test('user can create a new transaction', async () => {
  const response = await supertest(app.server).post('/transactions').send({
    title: 'New transaction',
    amount: 2000,
    type: 'debit',
  })

  expect(response.statusCode).toEqual(201)
})
