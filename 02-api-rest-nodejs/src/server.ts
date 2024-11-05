import fastify from 'fastify'
import { knex } from './database'
import { env } from './env'

const app = fastify()

app.get('/', async () => {
  const tables = await knex('transactions')
    .select('*')
    .where('amount', 1000.111)

  return tables
})

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log(`Server running - PORT: ${env.PORT}`)
  })
