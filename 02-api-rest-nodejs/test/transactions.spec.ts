import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import request from 'supertest'
import { execSync } from 'child_process'
import { app } from '../src/app'

describe('Transactions routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
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

  it('should be able to get a specific transaction', async () => {
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

    const transactionId = listTransactionsResponse.body.transactions[0].id

    const getTransactionResponse = await request(app.server)
      .get(`/transactions/${transactionId}`)
      .set('Cookie', cookies)

    expect(listTransactionsResponse.statusCode).toEqual(200)
    expect(getTransactionResponse.statusCode).toEqual(200)
    expect(getTransactionResponse.body).toEqual({
      transaction: expect.objectContaining({
        title: 'New transaction',
        amount: -2000,
      }),
    })
  })

  it('should be able to get the summary', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'Debit transaction',
        amount: 2000,
        type: 'debit',
      })

    const cookies = createTransactionResponse.get('Set-Cookie') ?? []

    await request(app.server)
      .post('/transactions')
      .set('Cookie', cookies)
      .send({
        title: 'Credit transaction',
        amount: 1000,
        type: 'credit',
      })

    const getSummaryResponse = await request(app.server)
      .get('/transactions/summary')
      .set('Cookie', cookies)

    expect(getSummaryResponse.statusCode).toEqual(200)
    expect(getSummaryResponse.body).toEqual({
      summary: {
        amount: -1000,
      },
    })
  })
})
