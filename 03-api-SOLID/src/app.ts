import fastify from 'fastify'
import fastifyJwt from '@fastify/jwt'
import { ZodError } from 'zod'
import { env } from './env'
import { usersRoutes } from './http/controllers/users/routes'

export const app = fastify()

app.register(usersRoutes)
app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation error', issues: error.format() })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    // @to-do: create log to external tool (Datadog/Newrelic/Sentry)
  }

  return reply.status(500).send({ message: 'Internal server error' })
})
