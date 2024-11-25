import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { checkSessionIdExists } from '../middleware/check-session-id-exists'
import { knex } from '../database'
import { randomUUID } from 'crypto'

export async function mealsRoutes(app: FastifyInstance) {
  app.post(
    '/',
    { preHandler: [checkSessionIdExists] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const createMealBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        dateTime: z.string(),
        isWithinDiet: z.boolean(),
      })

      const { name, description, dateTime, isWithinDiet } =
        createMealBodySchema.parse(request.body)

      const { user } = request

      const mealId = await knex('meals').insert(
        {
          id: randomUUID(),
          user_id: user?.id,
          name,
          description,
          date_time: dateTime,
          is_within_diet: isWithinDiet,
        },
        'id',
      )

      return reply.status(201).send({ meal: mealId[0] })
    },
  )
}
