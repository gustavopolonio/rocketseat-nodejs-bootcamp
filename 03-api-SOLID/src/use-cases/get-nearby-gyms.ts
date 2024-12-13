import { GymsRepository } from '@/repositories/gyms-repository'
import { Gym } from '@prisma/client'

interface GetNearbyGymsUseCaseProps {
  userLatitude: number
  userLongitude: number
  page: number
}

interface GetNearbyGymsUseCaseResponse {
  gyms: Gym[]
}

export class GetNearbyGymsUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    userLatitude,
    userLongitude,
    page,
  }: GetNearbyGymsUseCaseProps): Promise<GetNearbyGymsUseCaseResponse> {
    const gyms = await this.gymsRepository.getManyNearby(
      {
        userLatitude,
        userLongitude,
      },
      page,
    )

    return { gyms }
  }
}
