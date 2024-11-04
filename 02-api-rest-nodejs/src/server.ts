import fastify from 'fastify'

const app = fastify()

app.get('/ping', () => {
  return 'pong'
})

app
  .listen({
    port: 3000,
  })
  .then(() => {
    console.log('Server running')
  })
