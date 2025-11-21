import { Table, Column, Model, DataType } from 'sequelize-typescript';

export interface BookAttributes {
    id: number;
    title: string;
    author: string;
    genre: string;
    publication: number;
    resume: string;
}

@Table({
  tableName: 'books',
})
export class Book extends Model<BookAttributes> implements BookAttributes {
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

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare coverUrl: string;

}
