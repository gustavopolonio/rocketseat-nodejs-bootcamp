import { GymsRepository } from '@/repositories/gyms-repository'
import { Gym } from '@prisma/client'

interface GetNearbyGymsUseCaseProps {
  userLatitude: number
  userLongitude: number
}

interface GetNearbyGymsUseCaseResponse {
  gyms: Gym[]
}

export class GetNearbyGymsUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    userLatitude,
    userLongitude,
  }: GetNearbyGymsUseCaseProps): Promise<GetNearbyGymsUseCaseResponse> {
    const gyms = await this.gymsRepository.getManyNearby({
      userLatitude,
      userLongitude,
    })

    return { gyms }
  }
}
