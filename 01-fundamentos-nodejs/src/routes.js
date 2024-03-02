import { randomUUID } from 'node:crypto'

import { Database } from './database.js'
import { buildRoutePath } from './utils/build-route-path.js'

const database = new Database()

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/users'),
    handler: (req, res) => {
      const { name } = req.query

      const users = database.select('users', name)

      return res.end(JSON.stringify(users))
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/users'),
    handler: async (req, res) => {
      const { name, age } = req.body

      const user = {
        id: randomUUID(),
        name,
        age
      }
  
      await database.insert('users', user)
  
      return res.writeHead(201).end()
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/users/:id'),
    handler: async (req, res) => {
      const { id } = req.params
      const { name, age } = req.body

      await database.update('users', id, {
        name,
        age
      })

      return res.writeHead(204).end()
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/users/:id'),
    handler: async (req, res) => {
      const { id } = req.params
      await database.delete('users', id)

      return res.writeHead(204).end()
    }
  },
]