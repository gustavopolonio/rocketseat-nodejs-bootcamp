import http from 'node:http'

// HTTP methods
// GET, POST, PUT, PATCH, DELETE

// GET => Buscar um recurso do back-end
// POST => Criar um recurso no back-end
// PUT => Atualizar um recurso no back-end
// PATCH => Atualizar uma informação específica de um recurso no back-end
// DELETE => Deletar um recurso no back-end


const server = http.createServer((req, res) => {
  const { method, url } = req
  
  if (method === 'GET' && url === '/users') {
    console.log('Listagem de usuários')
  }

  if (method === 'POST' && url === '/users') {
    console.log('Criação de usuários')
  }

  return res.end('Hello!')
})

server.listen(3333)