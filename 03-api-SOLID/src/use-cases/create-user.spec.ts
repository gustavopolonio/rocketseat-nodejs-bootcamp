import { describe, expect, it } from 'vitest'
import { compare } from 'bcryptjs'
import { CreateUserUseCase } from './create-user'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

describe('Create User Use Case', () => {
  it('should hash user password upon user creation', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const createUserUseCase = new CreateUserUseCase(usersRepository)

    const password = '123456'

    const { user } = await createUserUseCase.execute({
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
    const createUserUseCase = new CreateUserUseCase(usersRepository)

    const email = 'user01@test.test'

    await createUserUseCase.execute({
      name: 'User test 01',
      email,
      password: '123456',
    })

    await expect(
      createUserUseCase.execute({
        name: 'User test 02',
        email,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
