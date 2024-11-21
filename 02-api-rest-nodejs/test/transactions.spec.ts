import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '../src/app'

describe('Transactions routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a new transaction', async () => {
    const response = await request(app.server).post('/transactions').send({
      title: 'New transaction',
      amount: 2000,
      type: 'debit',
    })

    expect(response.statusCode).toEqual(201)
  })

  it('should be able to list all transactions', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'New transaction',
        amount: 2000,
        type: 'debit',
      })

    const cookies = createTransactionResponse.get('Set-Cookie') ?? []

    const listTransactionsResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)

    expect(listTransactionsResponse.statusCode).toEqual(200)
    expect(listTransactionsResponse.body).toEqual({
      transactions: [
        expect.objectContaining({
          title: 'New transaction',
          amount: -2000,
        }),
      ],
    })
  })
})
