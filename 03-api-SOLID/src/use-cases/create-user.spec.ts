import { describe, expect, it } from 'vitest'
import { compare } from 'bcryptjs'
import { CreateUserUseCase } from './create-user'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

describe('Create User Use Case', () => {
  it('should be able to create a user', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const sut = new CreateUserUseCase(usersRepository)

    const { user } = await sut.execute({
      name: 'User test 01',
      email: 'user01@test.test',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password upon user creation', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const sut = new CreateUserUseCase(usersRepository)

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

  it('should not be able to create a user with an existing email', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const sut = new CreateUserUseCase(usersRepository)

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
