import { FastifyInstance } from 'fastify'
import request from 'supertest'
import { RegisterUseCaseProps } from '@/use-cases/register'
import { prisma } from '@/lib/prisma'

export async function createAndAuthenticateUser(
  app: FastifyInstance,
  user: RegisterUseCaseProps,
  isAdmin = false,
) {
  const { name, email, password } = user

  await request(app.server).post('/users').send({
    name,
    email,
    password,
  })

  if (isAdmin) {
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        email,
      },
    })

    await prisma.user.update({
      where: {
        email,
      },
      data: {
        ...user,
        role: 'ADMIN',
      },
    })
  }

  const authenticationResponse = await request(app.server)
    .post('/sessions')
    .send({
      email,
      password,
    })

  return { token: authenticationResponse.body.token }
}
