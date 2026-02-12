import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { UserDao } from '../dao/user.dao';
import { User } from '../model/user.model';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserStateEnum } from '../constants/user-state.enum';
import { UpdateUserDto } from '../dto/update-user.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserService {
  constructor(private readonly userDao: UserDao) {}

  async findAll(): Promise<User[]> {
    return this.userDao.findAll();
  }

  async findById(idUser: number): Promise<User> {
    return this.getUserOrFail(idUser);
  }

  async findByUuid(uuid: string): Promise<User> {
    const user = await this.userDao.findByUuid(uuid);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userDao.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }
    const userData: Partial<User> = {
      ...createUserDto,
      uuid: uuidv4(),
      state: UserStateEnum.ACTIVE,
      lastLogin: createUserDto.lastLogin ? new Date(createUserDto.lastLogin) : undefined,
    };

    return this.userDao.create(userData);
  }

  async update(idUser: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.getUserOrFail(idUser);

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existing = await this.userDao.findByEmail(updateUserDto.email);
      if (existing) {
        throw new ConflictException('Email already exists');
      }
    }
    await this.userDao.update(idUser, {
      ...updateUserDto,
      lastLogin: updateUserDto.lastLogin ? new Date(updateUserDto.lastLogin) : undefined,
    });

    return this.getUserOrFail(idUser);
  }

  async delete(idUser: number): Promise<void> {
    await this.getUserOrFail(idUser);

    await this.userDao.delete(idUser);
  }

  private async getUserOrFail(idUser: number): Promise<User> {
    const user = await this.userDao.findById(idUser);

    if (!user) {
      throw new NotFoundException(`User with id ${idUser} not found`);
    }

    return user;
  }
}
