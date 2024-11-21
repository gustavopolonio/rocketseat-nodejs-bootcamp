import fastify from 'fastify'
import { env } from './env'

const app = fastify()

app.get('/ping', () => {
  return 'pong'
})

app.listen({ port: env.PORT }).then(() => {
  console.log(`Server running - PORT: ${env.PORT}`)
})
