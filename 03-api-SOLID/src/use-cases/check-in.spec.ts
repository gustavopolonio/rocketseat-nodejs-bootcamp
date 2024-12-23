import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'
import { CheckInUseCase } from './check-in'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { GymsRepository } from '@/repositories/gyms-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { MaxDistanceError } from './errors/max-distance-error'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error'

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
    const gym = await gymsRepository.create({
      name: 'Gym 01',
      latitude: 0,
      longitude: 0,
    })

    const { checkIn } = await sut.execute({
      userId: 'user-01',
      gymId: gym.id,
      userLatitude: 0,
      userLongitude: 0,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice on the same day', async () => {
    const gym = await gymsRepository.create({
      name: 'Gym 01',
      latitude: 0,
      longitude: 0,
    })

    vi.setSystemTime(new Date(2000, 0, 1, 10))

    await sut.execute({
      userId: 'user-01',
      gymId: gym.id,
      userLatitude: 0,
      userLongitude: 0,
    })

    await expect(
      sut.execute({
        userId: 'user-01',
        gymId: gym.id,
        userLatitude: 0,
        userLongitude: 0,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('should be able to check in twice on different days', async () => {
    const checkIn = await gymsRepository.create({
      name: 'Gym 01',
      latitude: 0,
      longitude: 0,
    })

    vi.setSystemTime(new Date(2000, 0, 1, 10))

    await sut.execute({
      userId: 'user-01',
      gymId: checkIn.id,
      userLatitude: 0,
      userLongitude: 0,
    })

    vi.setSystemTime(new Date(2000, 0, 2, 10))

    await expect(
      sut.execute({
        userId: 'user-01',
        gymId: checkIn.id,
        userLatitude: 0,
        userLongitude: 0,
      }),
    ).resolves.toEqual({
      checkIn: expect.objectContaining({
        gym_id: checkIn.id,
        user_id: 'user-01',
        created_at: new Date(),
      }),
    })
  })

  it('should not be able to check in on an unexisting gym', async () => {
    await expect(
      sut.execute({
        userId: 'user-01',
        gymId: 'non-existing-id',
        userLatitude: 0,
        userLongitude: 0,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to check in on a distant gym', async () => {
    const checkIn = await gymsRepository.create({
      name: 'Gym 01',
      latitude: 0,
      longitude: 0,
    })

    await expect(
      sut.execute({
        gymId: checkIn.id,
        userId: 'user-01',
        userLatitude: -21.9979778,
        userLongitude: -47.8983264,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
