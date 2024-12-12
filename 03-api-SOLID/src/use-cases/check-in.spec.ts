import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'
import { CheckInUseCase } from './check-in'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { GymsRepository } from '@/repositories/gyms-repository'

let gymsRepository: GymsRepository
let sut: CheckInUseCase

describe('Check-in Use Case', () => {
  beforeEach(() => {
    vi.useFakeTimers()

    const checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkInsRepository, gymsRepository)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const gymId = 'gym-01'

    await gymsRepository.create({
      id: gymId,
      name: 'Gym 01',
      latitude: 0,
      longitude: 0,
    })

    const { checkIn } = await sut.execute({
      userId: 'user-01',
      gymId,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice on the same day', async () => {
    const gymId = 'gym-01'

    await gymsRepository.create({
      id: gymId,
      name: 'Gym 01',
      latitude: 0,
      longitude: 0,
    })

    vi.setSystemTime(new Date(2000, 0, 1, 10))

    await sut.execute({
      userId: 'user-01',
      gymId,
    })

    await expect(
      sut.execute({
        userId: 'user-01',
        gymId,
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should be able to check in twice on different days', async () => {
    const gymId = 'gym-01'

    await gymsRepository.create({
      id: gymId,
      name: 'Gym 01',
      latitude: 0,
      longitude: 0,
    })

    vi.setSystemTime(new Date(2000, 0, 1, 10))

    await sut.execute({
      userId: 'user-01',
      gymId,
    })

    vi.setSystemTime(new Date(2000, 0, 2, 10))

    await expect(
      sut.execute({
        userId: 'user-01',
        gymId,
      }),
    ).resolves.toEqual({
      checkIn: expect.objectContaining({
        gym_id: gymId,
        user_id: 'user-01',
        created_at: new Date(),
      }),
    })
  })
})
