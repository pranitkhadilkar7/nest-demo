import { Test } from '@nestjs/testing'
import { AuthService } from './auth.service'
import { UsersService } from './users.service'
import { User } from './user.entity'
import { BadRequestException, NotFoundException } from '@nestjs/common'

describe('AuthService', () => {
  let service: AuthService
  let mockUsersService: Partial<UsersService>

  beforeEach(async () => {
    const users: User[] = []
    mockUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email)
        return Promise.resolve(filteredUsers)
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 999999),
          email,
          password,
        } as User
        users.push(user)
        return Promise.resolve(user)
      },
    }
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile()
    service = module.get(AuthService)
  })

  it('should create an instance of auth service', async () => {
    expect(service).toBeDefined()
  })

  it('should create a new user with salted and hashed password', async () => {
    const email = 'test@test.com'
    const password = 'password'
    const user = await service.signup(email, password)
    expect(user.password).not.toEqual(password)
    const [salt, hash] = user.password.split('.')
    expect(salt).toBeDefined()
    expect(hash).toBeDefined()
  })

  it('should throw an error when user tries to signup with email that is already in use', async () => {
    await service.signup('a', 'a')
    await expect(service.signup('a', 'p')).rejects.toThrow(BadRequestException)
  })

  it('should throw an error when user tries to signin with unused email', async () => {
    await expect(service.signin('a', 'p')).rejects.toThrow(NotFoundException)
  })

  it('should throw an error when user tries to signin with invalid passowrd', async () => {
    await service.signup('a', 'p')
    await expect(service.signin('a', 'px')).rejects.toThrow(BadRequestException)
  })

  it('should return a user if user tries to signin with correct password', async () => {
    const email = 'test@test.com'
    const password = 'password'
    await service.signup(email, password)
    const user = await service.signin(email, password)
    expect(user).toBeDefined()
  })
})
