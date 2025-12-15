import { Injectable, NotFoundException } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { UserAttributes } from './models/user.model';
import { User } from './models/user.model';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class UsersService {
 
constructor(
  @InjectModel(User)
  private userModel: typeof User,
) {}

 async findByUserName(username: string): Promise<User | null> {
    return this.userModel.findOne({ where: { email: username } });
  }

  async updateavatarKey(id: number, avatarKey: string | null): Promise<User> {
    const user = await this.findOne(id);
    user.avatarKey = avatarKey;
    return await user.save();
  }

  async findAll(page: number = 1, limit: number = 10) {
    const offset = (page - 1) * limit;

    const { rows, count } = await this.userModel.findAndCountAll({
      limit: limit,
      offset: offset,
    });

    const totalPages = Math.ceil(count / limit);

    return {
      data: rows,
      meta: {
        totalItems: count,
        totalPages,
        currentPage: page,
        itemsPerPage: limit,
      },
    };
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(createUserDto.password, saltOrRounds);

    return this.userModel.create({
      ...createUserDto,
      password: hashedPassword,
      role: createUserDto.role ?? 'user',
      avatarKey: null, 
    });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userModel.findByPk(id);
    if (!user) {
      throw new NotFoundException(`User ID ${id} not found`);
    }
    return user;
  }
  

  async update(id: number, updateUserDto: UpdateUserDTO) {
    const [numberOfAffectedRows, [updatedUser]] = await this.userModel.update(
      { ...updateUserDto },
      { where: { id }, returning: true }
    );

    if (numberOfAffectedRows === 0) {
      throw new NotFoundException(`User ID ${id} not found`);
    }
    
    return updatedUser;
  }


  async remove(id: number): Promise<void> {
    const affectedRows = await this.userModel.destroy({ where: { id } });

    if (affectedRows === 0) {
        throw new NotFoundException(`User ID ${id} not found`);
    }
  }
}
