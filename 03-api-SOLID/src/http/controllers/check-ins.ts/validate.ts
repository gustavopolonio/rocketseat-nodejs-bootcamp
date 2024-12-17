import { ExpiredCheckInValidationError } from '@/use-cases/errors/expired-check-in-validation-error'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { makeValidateCheckInUseCase } from '@/use-cases/factories/make-validate-check-in-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function validate(request: FastifyRequest, reply: FastifyReply) {
  const validateCheckParamsSchema = z.object({
    checkInId: z.string().uuid(),
  })

  const { checkInId } = validateCheckParamsSchema.parse(request.params)

  try {
    const validateCheckInUseCase = makeValidateCheckInUseCase()

    await validateCheckInUseCase.execute({
      checkInId,
    })

    return reply.status(204).send()
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }

    if (err instanceof ExpiredCheckInValidationError) {
      return reply.status(500).send({ message: err.message })
    }

    throw err
  }
}
