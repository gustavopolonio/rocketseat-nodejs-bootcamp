import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { randomUUID } from 'crypto'
import { z } from 'zod'
import { knex } from '../database'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/', async (request: FastifyRequest, reply: FastifyReply) => {
    const createUserBodySchema = z.object({
      name: z.string(),
      email: z.string().email(),
    })

    const { name, email } = createUserBodySchema.parse(request.body)

    const userByEmail = await knex('users').where('email', email).first()

    if (userByEmail) {
      return reply.status(400).send({ message: 'User already exists' })
    }

    const sessionId = randomUUID()
    reply.setCookie('sessionId', sessionId, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    const userId = await knex('users').insert(
      {
        id: randomUUID(),
        session_id: sessionId,
        name,
        email,
      },
      'id',
    )

    return reply.status(201).send({ user: userId[0] })
  })
}
