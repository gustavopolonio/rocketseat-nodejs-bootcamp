import { Gym, Prisma } from '@prisma/client'
import { GetManyNearby, GymsRepository } from '../gyms-repository'
import { randomUUID } from 'node:crypto'
import { getDistanceInKilometersBetweenCoordinates } from '@/utils/get-distance-between-coordinates'

export class InMemoryGymsRepository implements GymsRepository {
  public items: Gym[] = []

  async findById(gymId: string) {
    const gym = this.items.find((gym) => gym.id === gymId)

    if (!gym) return null

    return gym
  }

  async searchMany(query: string, page: number) {
    return this.items
      .filter((gym) => gym.name.toLowerCase().includes(query.toLowerCase()))
      .slice((page - 1) * 20, page * 20)
  }

  async getManyNearby(params: GetManyNearby) {
    return this.items.filter((gym) => {
      const distance = getDistanceInKilometersBetweenCoordinates(
        {
          latitude: params.userLatitude,
          longitude: params.userLongitude,
        },
        { latitude: Number(gym.latitude), longitude: Number(gym.longitude) },
      )

      return distance < 10
    })
  }

  async create(data: Prisma.GymCreateManyInput) {
    const gym = {
      id: data.id ?? randomUUID(),
      name: data.name,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: new Prisma.Decimal(Number(data.latitude)),
      longitude: new Prisma.Decimal(Number(data.latitude)),
    }

    this.items.push(gym)

    return gym
  }
}
