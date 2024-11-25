import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { checkSessionIdExists } from '../middleware/check-session-id-exists'
import { knex } from '../database'
import { randomUUID } from 'crypto'

export async function mealsRoutes(app: FastifyInstance) {
  app.get(
    '/',
    { preHandler: [checkSessionIdExists] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { user } = request

      const meals = await knex('meals')
        .where('user_id', user?.id)
        .orderBy('created_at', 'desc')

      return reply.send({ meals })
    },
  )

  app.get(
    '/:mealId',
    { preHandler: [checkSessionIdExists] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const getMealParamsSchema = z.object({
        mealId: z.string().uuid(),
      })

      const { mealId } = getMealParamsSchema.parse(request.params)

      const { user } = request

      const meal = await knex('meals')
        .where({
          id: mealId,
          user_id: user?.id,
        })
        .first()

      if (!meal) {
        return reply.status(404).send({ error: 'Meal not found' })
      }

      return reply.send({ meal })
    },
  )

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

  app.put(
    '/:mealId',
    { preHandler: [checkSessionIdExists] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const updateMealParamsSchema = z.object({
        mealId: z.string().uuid(),
      })

      const { mealId } = updateMealParamsSchema.parse(request.params)

      const updateMealBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        dateTime: z.string(),
        isWithinDiet: z.boolean(),
      })

      const { name, description, dateTime, isWithinDiet } =
        updateMealBodySchema.parse(request.body)

      const { user } = request

      const meal = await knex('meals')
        .where({
          id: mealId,
          user_id: user?.id,
        })
        .first()

      if (!meal) {
        return reply.status(404).send({ error: 'Meal not found' })
      }

      await knex('meals').where('id', meal.id).update({
        name,
        description,
        date_time: dateTime,
        is_within_diet: isWithinDiet,
      })

      return reply.status(204).send()
    },
  )

  app.delete(
    '/:mealId',
    { preHandler: [checkSessionIdExists] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const deleteMealParamsSchema = z.object({
        mealId: z.string().uuid(),
      })

      const { mealId } = deleteMealParamsSchema.parse(request.params)

      const { user } = request

      const meal = await knex('meals')
        .where({
          id: mealId,
          user_id: user?.id,
        })
        .first()

      if (!meal) {
        return reply.status(404).send({ error: 'Meal not found' })
      }

      await knex('meals')
        .where({
          id: mealId,
          user_id: user?.id,
        })
        .del()

      return reply.status(204).send()
    },
  )
}
