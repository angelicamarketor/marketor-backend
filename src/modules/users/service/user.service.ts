import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';

import { UserDao } from '../dao/user.dao';
import { User } from '../model/user.model';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly userDao: UserDao) {}

  async findAll(): Promise<User[]> {
    return this.userDao.findAll();
  }

  async findById(id: string): Promise<User> {
    return this.getUserOrFail(id);
  }

  async create(dto: CreateUserDto): Promise<User> {
    const existing = await this.userDao.findByEmail(dto.email);

    if (existing) {
      throw new ConflictException('Email already exists');
    }

    return this.userDao.create({
      ...dto,
      lastLogin: dto.lastLogin ? new Date(dto.lastLogin) : undefined,
    });
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.getUserOrFail(id);

    if (dto.email && dto.email !== user.email) {
      const existing = await this.userDao.findByEmail(dto.email);

      if (existing) {
        throw new ConflictException('Email already exists');
      }
    }
    await this.userDao.update(id, {
      ...dto,
      lastLogin: dto.lastLogin ? new Date(dto.lastLogin) : undefined,
    });

    return this.getUserOrFail(id);
  }

  async delete(id: string): Promise<void> {
    await this.getUserOrFail(id);

    await this.userDao.delete(id);
  }

  private async getUserOrFail(id: string): Promise<User> {
    const user = await this.userDao.findById(id);

    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }

    return user;
  }
}
