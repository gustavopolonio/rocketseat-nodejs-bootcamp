import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'
import { CheckInUseCase } from './check-in'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { GymsRepository } from '@/repositories/gyms-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

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
      userLatitude: 0,
      userLongitude: 0,
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
      userLatitude: 0,
      userLongitude: 0,
    })

    await expect(
      sut.execute({
        userId: 'user-01',
        gymId,
        userLatitude: 0,
        userLongitude: 0,
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it.only('should be able to check in twice on different days', async () => {
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
      userLatitude: 0,
      userLongitude: 0,
    })

    vi.setSystemTime(new Date(2000, 0, 2, 10))

    await expect(
      sut.execute({
        userId: 'user-01',
        gymId,
        userLatitude: 0,
        userLongitude: 0,
      }),
    ).resolves.toEqual({
      checkIn: expect.objectContaining({
        gym_id: gymId,
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
})
