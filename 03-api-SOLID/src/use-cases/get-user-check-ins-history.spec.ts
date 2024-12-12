import { beforeEach, describe, expect, it } from 'vitest'
import { GetUserCheckInsHistoryUseCase } from './get-user-check-ins-history'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'

let checkInsRepository: InMemoryCheckInsRepository
let sut: GetUserCheckInsHistoryUseCase

describe('Get User Check-ins History Use Case', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new GetUserCheckInsHistoryUseCase(checkInsRepository)
  })

  it('should be able to get user check-ins history', async () => {
    const userId = 'user-01'

    await checkInsRepository.create({
      user_id: userId,
      gym_id: 'gym-01',
    })

    await checkInsRepository.create({
      user_id: userId,
      gym_id: 'gym-02',
    })

    await checkInsRepository.create({
      user_id: 'user-02',
      gym_id: 'gym-02',
    })

    const { checkIns } = await sut.execute({
      userId,
      page: 1,
    })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({
        user_id: userId,
        gym_id: 'gym-01',
      }),
      expect.objectContaining({
        user_id: userId,
        gym_id: 'gym-02',
      }),
    ])
  })

  it('should be able to get paginated user check-ins history', async () => {
    const userId = 'user-01'

    for (let i = 1; i <= 22; i++) {
      await checkInsRepository.create({
        user_id: userId,
        gym_id: `gym-${i}`,
      })
    }

    await checkInsRepository.create({
      user_id: 'user-02',
      gym_id: 'gym-02',
    })

    const { checkIns } = await sut.execute({
      userId,
      page: 2,
    })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({
        user_id: userId,
        gym_id: 'gym-21',
      }),
      expect.objectContaining({
        user_id: userId,
        gym_id: 'gym-22',
      }),
    ])
  })
})
