import { FastifyInstance } from 'fastify'
import request from 'supertest'
import { RegisterUseCaseProps } from '@/use-cases/register'

export async function createAndAuthenticateUser(
  app: FastifyInstance,
  user: RegisterUseCaseProps,
) {
  const { name, email, password } = user

  await request(app.server).post('/users').send({
    name,
    email,
    password,
  })

  const authenticationResponse = await request(app.server)
    .post('/sessions')
    .send({
      email,
      password,
    })

  return { token: authenticationResponse.body.token }
}
