import { Table, Column, Model, DataType, PrimaryKey } from 'sequelize-typescript';

@Table({
  tableName: 'state',
  timestamps: false,
})
export class State extends Model {
  @PrimaryKey
  @Column(DataType.INTEGER)
  declare idState: number;

  @Column(DataType.STRING(20))
  name: string;
}
