import { Test, TestingModule } from '@nestjs/testing'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'
import { AuthService } from './auth.service'
import { User } from './user.entity'
import { NotFoundException } from '@nestjs/common'

describe('UsersController', () => {
  let controller: UsersController
  let mockUsersService: Partial<UsersService>
  let mockAuthService: Partial<AuthService>

  beforeEach(async () => {
    mockUsersService = {
      findOne: (id: number) =>
        Promise.resolve({ id, email: 'a', password: 'p' } as User),
      find: (email: string) =>
        Promise.resolve([{ id: 1, email, password: 'p' } as User]),
    }
    mockAuthService = {
      signin: (email: string, password: string) =>
        Promise.resolve({ id: 1, email, password } as User),
    }
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: mockUsersService },
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compile()

    controller = module.get<UsersController>(UsersController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  it('should return list of all users when findAllUsers is called', async () => {
    const users = await controller.findAllUsers('a')
    expect(users.length).toBe(1)
    expect(users[0].email).toEqual('a')
  })

  it('should return a single user when findUser is called', async () => {
    const user = await controller.findUser(1)
    expect(user).toBeDefined()
    expect(user.id).toBe(1)
  })

  it('should throw an exection when findUser is called', async () => {
    mockUsersService.findOne = () => null
    await expect(controller.findUser(1)).rejects.toThrow(NotFoundException)
  })

  it('should return a user and update a session when signin is called', async () => {
    const session = { userId: -1 }
    const user = await controller.signin({ email: 'a', password: 'p' }, session)
    expect(user).toBeDefined()
    expect(session.userId).toEqual(1)
  })
})
