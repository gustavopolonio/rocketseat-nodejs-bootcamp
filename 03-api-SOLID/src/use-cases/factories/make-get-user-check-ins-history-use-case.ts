import { GetUserCheckInsHistoryUseCase } from '../get-user-check-ins-history'
import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'

export function makeGetUserCheckInsHistoryUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository()
  const useCase = new GetUserCheckInsHistoryUseCase(checkInsRepository)

  return useCase
}
