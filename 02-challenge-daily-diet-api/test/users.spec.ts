import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import request from 'supertest'
import { execSync } from 'node:child_process'
import { app } from '../src/app'

describe('Users route', () => {
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

  it('should be able to create a user', async () => {
    const response = await request(app.server).post('/users').send({
      name: 'Gustavo',
      email: 'gustavo@test.com',
    })

    expect(response.statusCode).toEqual(201)
  })

  it('should not be able to create an existing user', async () => {
    await request(app.server).post('/users').send({
      name: 'Gustavo',
      email: 'gustavo@test.com',
    })

    const response = await request(app.server).post('/users').send({
      name: 'Gustavo',
      email: 'gustavo@test.com',
    })

    expect(response.status).toBe(400)
    expect(response.body.message).toBe('User already exists')
  })
})
