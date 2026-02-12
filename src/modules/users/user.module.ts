import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './model/user.model';
import { UserController } from './controller/user.controller';
import { UserService } from './service/user.service';
import { UserDao } from './dao/user.dao';

@Module({
  imports: [SequelizeModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService, UserDao],
})
export class UserModule {}
