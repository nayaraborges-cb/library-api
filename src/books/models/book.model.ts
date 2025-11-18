import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'books',
})
export class Book extends Model<Book> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare title: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare author: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare genre: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare publication: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare resume: string;
}
