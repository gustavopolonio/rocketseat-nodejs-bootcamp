import { verifyJwt } from '@/http/middleware/verify-jwt'
import { FastifyInstance } from 'fastify'
import { create } from './create'
import { search } from './search'

export async function gymsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)

  app.get('/gyms', search)
  app.post('/gyms', create)
}
