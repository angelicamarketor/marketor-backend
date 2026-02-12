import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { getDatabaseConfig } from './database/database.config';
import { WinstonModule } from 'nest-winston';
import winston from 'winston';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }),

  SequelizeModule.forRootAsync({
    inject: [ConfigService],
    useFactory: getDatabaseConfig,
  }),
  WinstonModule.forRoot({
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.ms(),
          winston.format.json(),
        ),
      }),
    ],
  }),
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter
    }
  ]
})
export class AppModule { }
