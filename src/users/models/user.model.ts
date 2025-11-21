import { Table, Column, Model, DataType, AllowNull } from 'sequelize-typescript';


export interface UserAttributes {
  id: number;
  name: string;
  email: string;
  password: string;
}

@Table({
  tableName: 'users',
})
export class User extends Model<UserAttributes> implements UserAttributes {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare password: string;

 @Column({
  type: DataType.STRING,
  allowNull: true,
 })
  declare avatarUrl: string;
}
