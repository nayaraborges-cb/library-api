import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  private users: User[] = [
    {
      id: 1,
      name: "Asmodan",
      email: "redstone@gmail.com",
      password: "pass",
    },
  ]

  create(createUserDto: any) {
    this.users.push(createUserDto)
  }

  findAll() {
    return this.users
  }

  findOne(id: number) {
    const user = this.users.find(user => user.id === id) 
    if (!user) {
      throw new NotFoundException(`User ID ${id} not found`)
    }
    return user
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    const existingUser = this.findOne(id)
    if (existingUser as any) {
      const index = this.users.findIndex(user => user.id === id)
      this.users[index] = {
        id,
        ...updateUserDto,
      } as User;
    }
  }

  remove(id: number) {
    const index = this.users.findIndex( user => user.id === id)
    if (index >= 0) {
      this.users.splice(index, 1)
    }
  }
}
