import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './model/user.model';
import { UserController } from './controller/user.controller';
import { UserService } from './service/user.service';
import { UserDao } from './dao/user.dao';
import { State } from 'src/common/catalogs/state/state.model';

@Module({
  imports: [SequelizeModule.forFeature([User, State])],
  controllers: [UserController],
  providers: [UserService, UserDao],
})
export class UserModule {}
