import { beforeEach, describe, expect, it } from 'vitest'
import { GetNearbyGymsUseCase } from './get-nearby-gyms'
import { GymsRepository } from '@/repositories/gyms-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'

let gymsRepository: GymsRepository
let sut: GetNearbyGymsUseCase

describe('Get Nearby Gyms Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new GetNearbyGymsUseCase(gymsRepository)
  })

  it('should be able to get nearby gyms', async () => {
    await gymsRepository.create({
      name: 'Gym 01',
      latitude: 0,
      longitude: 0,
    })

    await gymsRepository.create({
      name: 'Gym 02',
      latitude: 0,
      longitude: 0,
    })

    await gymsRepository.create({
      name: 'Gym 03',
      latitude: 10,
      longitude: 10,
    })

    const { gyms } = await sut.execute({
      userLatitude: 0,
      userLongitude: 0,
      page: 1,
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({
        name: 'Gym 01',
      }),
      expect.objectContaining({
        name: 'Gym 02',
      }),
    ])
  })

  it('should be able to get paginated nearby gyms', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        name: `Gym - ${i}`,
        latitude: 0,
        longitude: 0,
      })
    }

    await gymsRepository.create({
      name: 'Gym 03',
      latitude: 10,
      longitude: 10,
    })

    const { gyms } = await sut.execute({
      userLatitude: 0,
      userLongitude: 0,
      page: 2,
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({
        name: 'Gym - 21',
      }),
      expect.objectContaining({
        name: 'Gym - 22',
      }),
    ])
  })
})
