import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../model/user.model';
import { UserService } from '../service/user.service';
import { UserID } from 'src/common/decorators/user.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get('id/:id')
  async findById(@Param('id') idUser: string): Promise<User> {
    return this.userService.findById(idUser);
  }

  @Get('profile')
  getProfile(@UserID() idUser: string) {
    console.log('ID recibido:', idUser);
    return this.userService.findById(idUser);
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @Put(':id')
  async update(@Param('id') idUser: string, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    return this.userService.update(idUser, updateUserDto);
  }

  @Delete(':id')
  async delete(@Param('id') idUser: string): Promise<void> {
    return this.userService.delete(idUser);
  }
}
