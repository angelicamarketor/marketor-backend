import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { getDatabaseConfig } from './database/database.config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }),

  SequelizeModule.forRootAsync({
    inject: [ConfigService],
    useFactory: getDatabaseConfig,
  }),],
})
export class AppModule { }
