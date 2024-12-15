import { GetNearbyGymsUseCase } from '../get-nearby-gyms'
import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'

export function makeGetNearbyGymsUseCase() {
  const gymsRepository = new PrismaGymsRepository()
  const useCase = new GetNearbyGymsUseCase(gymsRepository)

  return useCase
}
