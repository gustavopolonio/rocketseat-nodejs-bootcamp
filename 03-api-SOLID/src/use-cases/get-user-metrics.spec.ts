import { beforeEach, describe, expect, it } from 'vitest'
import { GetUserMetricsUseCase } from './get-user-metrics'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'

let checkInsRepository: InMemoryCheckInsRepository
let sut: GetUserMetricsUseCase

describe('Get User Metrics Use Case', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new GetUserMetricsUseCase(checkInsRepository)
  })

  it('should be able to get user check-ins count from metrics', async () => {
    const userId = 'user-01'

    await checkInsRepository.create({
      user_id: userId,
      gym_id: 'gym-01',
    })

    await checkInsRepository.create({
      user_id: userId,
      gym_id: 'gym-02',
    })

    const { checkInsCount } = await sut.execute({
      userId,
    })

    expect(checkInsCount).toEqual(2)
  })
})
