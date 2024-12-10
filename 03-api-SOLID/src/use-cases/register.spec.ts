import { beforeEach, describe, expect, it } from 'vitest'
import { compare } from 'bcryptjs'
import { RegisterUseCase } from './register'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

let sut: RegisterUseCase

describe('Regisster Use Case', () => {
  beforeEach(() => {
    const usersRepository = new InMemoryUsersRepository()
    sut = new RegisterUseCase(usersRepository)
  })

  it('should be able to register', async () => {
    const { user } = await sut.execute({
      name: 'User test 01',
      email: 'user01@test.test',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password upon user creation', async () => {
    const password = '123456'

    const { user } = await sut.execute({
      name: 'User test 01',
      email: 'user01@test.test',
      password,
    })

    const isPasswordCorrectlyHashed = await compare(
      password,
      user.password_hash,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register with an existing email', async () => {
    const email = 'user01@test.test'

    await sut.execute({
      name: 'User test 01',
      email,
      password: '123456',
    })

    await expect(
      sut.execute({
        name: 'User test 02',
        email,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
