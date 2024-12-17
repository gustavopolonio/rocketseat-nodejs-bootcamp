import { verifyJwt } from '@/http/middleware/verify-jwt'
import { FastifyInstance } from 'fastify'
import { create } from './create'

export async function gymsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)

  app.post('/gyms', create)
}
