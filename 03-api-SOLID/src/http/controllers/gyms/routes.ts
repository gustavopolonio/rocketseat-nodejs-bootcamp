import { FastifyInstance } from 'fastify'
import { verifyJwt } from '@/http/middleware/verify-jwt'
import { verifyUserRole } from '@/http/middleware/verify-user-role'
import { create } from './create'
import { search } from './search'
import { nearby } from './nearby'

export async function gymsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)

  app.get('/gyms/search', search)
  app.get('/gyms/nearby', nearby)

  app.post('/gyms', { onRequest: [verifyUserRole('ADMIN')] }, create)
}
