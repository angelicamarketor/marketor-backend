import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  Unique,
} from 'sequelize-typescript';
import { UserStateEnum } from '../constants/user-state.enum';

@Table({ tableName: 'user', timestamps: true, updatedAt: 'updatedAt', createdAt: 'createdAt' })
export class User extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  idUser: number;

  @AllowNull(false)
  @Unique
  @Column(DataType.UUID)
  uuid: string;

  @AllowNull(false)
  @Column(DataType.STRING(100))
  name: string;

  @AllowNull(false)
  @Unique
  @Column(DataType.STRING(100))
  email: string;

  @Column(DataType.STRING(20))
  phone: string;

  @Column(DataType.STRING(255))
  avatar: string;

  @Column(DataType.DATE)
  lastLogin: Date;

  @Column(DataType.STRING(100))
  idCognito: string;

  @AllowNull(false)
  @Column(DataType.STRING(20))
  state: UserStateEnum;
}
