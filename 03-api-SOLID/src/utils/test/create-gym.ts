import { FastifyInstance } from 'fastify'
import request from 'supertest'
import { CreateGymUseCaseProps } from '@/use-cases/create-gym'

export async function createGym(
  app: FastifyInstance,
  token: string,
  gym: CreateGymUseCaseProps,
) {
  const { name, description, phone, latitude, longitude } = gym

  const response = await request(app.server)
    .post('/gyms')
    .set('Authorization', `Bearer ${token}`)
    .send({
      name,
      description,
      phone,
      latitude,
      longitude,
    })

  return response
}
