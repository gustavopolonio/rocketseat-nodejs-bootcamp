import { Gym, Prisma } from '@prisma/client'

export interface GetManyNearby {
  userLatitude: number
  userLongitude: number
}

export interface GymsRepository {
  findById(gymId: string): Promise<Gym | null>
  searchMany(query: string, page: number): Promise<Gym[]>
  getManyNearby(params: GetManyNearby): Promise<Gym[]>
  create(data: Prisma.GymCreateManyInput): Promise<Gym>
}
