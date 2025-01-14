This bootcamp from [Rocketseat](https://app.rocketseat.com.br/) covers the main topics of back-end app's, from scratch to deploy, using Node.js.

### Content covered
* RESTful API
* Unit tests
* End-to-end tests
* SOLID
* Test Driven Development (TDD)
* JWT auth with refresh token
* Design patterns
* CI/CD
* Domain Driven Design (DDD)
* Clean architecture

### Main technologies covered
* TypeScript
* Fastify
* Docker
* PostgreSQL
* NestJS

To run the projects inside this repo you need to have installed in your machine: [Node](https://nodejs.org/en/download/), [npm](https://www.npmjs.com/) (or other package manager), [Git](https://git-scm.com/) 
and a code editor (I use [VSCode](https://code.visualstudio.com/)).

## :green_book: Module 1
RESTful API focused on the fundamentals of Node.js, without external frameworks or libraries. Contents covered: internal Node.js modules, especially HTTP and Streams, and HTTP fundamentals such as Requests, Responses, Headers, status code and the different types of parameters.

```bash

# Running module 1 project

# Clone this repository via HTTPS:
$ git clone https://github.com/gustavopolonio/rocketseat-nodejs-bootcamp.git

# Go into the module 1 directory:
$ cd 01-fundamentos-nodejs

# Run development environment:
$ npm run dev

```

## :green_book: Module 2
REST API using Fastify, Knex, TypeScript and other tools to assist during development.

```bash

# Running module 2 project

# Clone this repository via HTTPS:
$ git clone https://github.com/gustavopolonio/rocketseat-nodejs-bootcamp.git

# Go into the module 2 directory:
$ cd 02-api-rest-nodejs

# Install dependencies:
$ npm install

# Create your environment variables based on the examples of `.env.example` and `.env.test.example`
cp .env.example .env
cp .env.test.example .env.test

# Make sure to fill the `DATABASE_URL` variable with your own value. Since this project uses sqlite, you can create local databases, both for development and testing, inside the ./db folder.

# Run migrations:
$ npm run knex -- migrate:latest

# Run development environment:
$ npm run dev

```

## :green_book: Module 2 Challenge - Daily diet API
REST API for daily diet control using Fastify, Knex, TypeScript and other tools.

```bash

# Running module 2 challenge project

# Clone this repository via HTTPS:
$ git clone https://github.com/gustavopolonio/rocketseat-nodejs-bootcamp.git

# Go into the module 2 challenge directory:
$ cd 02-challenge-daily-diet-api

# Install dependencies:
$ npm install

# Create your environment variables based on the examples of `.env.example` and `.env.test.example`
cp .env.example .env
cp .env.test.example .env.test

# Make sure to fill the `DATABASE_URL` variable with your own value. Since this project uses sqlite, you can create local databases, both for development and testing, inside the ./db folder.

# Run migrations:
$ npm run knex -- migrate:latest

# Run development environment:
$ npm run dev

```

## :green_book: Module 3
An application for check-ins at gyms using SOLID concepts, Design Patterns, Docker to start the database, JWT and Refresh Token, RBAC and other concepts.

```bash

# Running module 3

# Clone this repository via HTTPS:
$ git clone https://github.com/gustavopolonio/rocketseat-nodejs-bootcamp.git

# Go into the module 3 directory:
$ cd 03-api-SOLID

# Install dependencies:
$ npm install

# Create your environment variables based on the examples of `.env.example`
cp .env.example .env

# Make sure to fill the `JWT_SECRET` and `DATABASE_URL` variables with your own values. JWT_SECRET can be any value. DATABASE_URL is based on docker-compose.yml file, so it must be: "postgresql://docker:docker@localhost:5432/apisolid?schema=public"

# Run docker (you need have installed Docker Desktop):
$ docker compose up

# Run development environment:
$ npm run dev

```

## :green_book: Module 4
Under development
