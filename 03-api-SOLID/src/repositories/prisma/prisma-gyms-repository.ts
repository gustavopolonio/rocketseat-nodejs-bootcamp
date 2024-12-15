import { Gym, Prisma } from '@prisma/client'
import { GetManyNearby, GymsRepository } from '../gyms-repository'
import { prisma } from '@/lib/prisma'

export class PrismaGymsRepository implements GymsRepository {
  async findById(gymId: string) {
    const gym = await prisma.gym.findUnique({
      where: {
        id: gymId,
      },
    })

    return gym
  }

  async searchMany(query: string, page: number) {
    const gyms = await prisma.gym.findMany({
      where: {
        name: {
          contains: query,
          mode: 'insensitive',
        },
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return gyms
  }

  async getManyNearby(
    { userLatitude, userLongitude }: GetManyNearby,
    page: number,
  ) {
    const gyms = await prisma.$queryRaw<Gym[]>`
      SELECT *
      FROM gyms
      WHERE (6371 * 2 * ATAN2(
        SQRT(
          POWER(SIN(RADIANS(latitude - ${userLatitude}) / 2), 2) +
          COS(RADIANS(${userLatitude})) *
          COS(RADIANS(latitude)) *
          POWER(SIN(RADIANS(longitude - ${userLongitude}) / 2), 2)
        ),
        SQRT(1 - 
          POWER(SIN(RADIANS(latitude - ${userLatitude}) / 2), 2) +
          COS(RADIANS(${userLatitude})) *
          COS(RADIANS(latitude)) *
          POWER(SIN(RADIANS(longitude - ${userLongitude}) / 2), 2)
        )
      )) < 10
      LIMIT 20
      OFFSET ${(page - 1) * 20};
    `

    return gyms
  }

  async create(data: Prisma.GymCreateManyInput) {
    const gym = await prisma.gym.create({
      data,
    })

    return gym
  }
}
