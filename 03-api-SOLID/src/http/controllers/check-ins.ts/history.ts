import { makeGetUserCheckInsHistoryUseCase } from '@/use-cases/factories/make-get-user-check-ins-history-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function history(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.user.sub

  const userCheckInHistoryQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  })

  const { page } = userCheckInHistoryQuerySchema.parse(request.query)

  const getUserCheckInsHistoryUseCase = makeGetUserCheckInsHistoryUseCase()

  const { checkIns } = await getUserCheckInsHistoryUseCase.execute({
    userId,
    page,
  })

  return reply.status(200).send({ checkIns })
}
