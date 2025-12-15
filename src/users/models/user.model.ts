import { Table, Column, Model, DataType } from 'sequelize-typescript';
import { Optional } from 'sequelize';

export interface UserAttributes {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string; //** */
  avatarKey: string  | null;
}

@Table({
  tableName: 'users',
})
export class User extends Model<UserAttributes, UserCreationAttributes> {
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
  defaultValue: null,
 })
  declare avatarKey: string | null;
  
  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: 'user',
  })
  declare role: string; 

}

export interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'avatarKey'> {}
