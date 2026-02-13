import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AllowNull,
  Unique,
  Default,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { State } from 'src/common/catalogs/state/state.model';
import { UserStateEnum } from '../constants/user-state.enum';

@Table({
  tableName: 'user',
  timestamps: true,
  updatedAt: 'updatedAt',
  createdAt: 'createdAt',
})
export class User extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare idUser: string;

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

  @ForeignKey(() => State)
  @AllowNull(false)
  @Default(UserStateEnum.ACTIVE)
  @Column(DataType.INTEGER)
  idState: number;

  @BelongsTo(() => State)
  state: State;
}
