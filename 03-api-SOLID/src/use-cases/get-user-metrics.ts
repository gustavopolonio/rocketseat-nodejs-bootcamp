import { CheckInsRepository } from '@/repositories/check-ins-repository'

interface GetUserMetricsUseCaseProps {
  userId: string
}

interface GetUserMetricsUseCaseResponse {
  checkInsCount: number
}

export class GetUserMetricsUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    userId,
  }: GetUserMetricsUseCaseProps): Promise<GetUserMetricsUseCaseResponse> {
    const checkInsCount = await this.checkInsRepository.countByUserId(userId)

    return { checkInsCount }
  }
}
