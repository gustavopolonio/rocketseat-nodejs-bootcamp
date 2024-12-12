import { beforeEach, describe, expect, it } from 'vitest'
import { SearchGymsUseCase } from './search-gyms'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'

let gymsRepository: InMemoryGymsRepository
let sut: SearchGymsUseCase

describe('Search Gyms Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new SearchGymsUseCase(gymsRepository)
  })

  it('should be able to search gyms by name', async () => {
    await gymsRepository.create({
      name: 'Javascript Gym',
      latitude: 0,
      longitude: 0,
    })

    await gymsRepository.create({
      name: 'Python Strong',
      latitude: 0,
      longitude: 0,
    })

    await gymsRepository.create({
      name: 'Javascript Surfists',
      latitude: 0,
      longitude: 0,
    })

    const { gyms } = await sut.execute({
      query: 'javascript',
      page: 1,
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({
        name: 'Javascript Gym',
      }),
      expect.objectContaining({
        name: 'Javascript Surfists',
      }),
    ])
  })

  it('should be able to search paginated gyms by name', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        name: `Javascript Gym - ${i}`,
        latitude: 0,
        longitude: 0,
      })
    }

    await gymsRepository.create({
      name: 'Python Strong',
      latitude: 0,
      longitude: 0,
    })

    const { gyms } = await sut.execute({
      query: 'javascript',
      page: 2,
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({
        name: 'Javascript Gym - 21',
      }),
      expect.objectContaining({
        name: 'Javascript Gym - 22',
      }),
    ])
  })
})
