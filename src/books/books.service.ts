import { Get, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { BookAttributes } from './models/book.model'; 
import { Book } from './models/book.model';

@Injectable()
export class BooksService {
  constructor(
    @InjectModel(Book)
    private bookModel: typeof Book,
  ) {}


  async create(createBookDto: CreateBookDto): Promise<Book> {
    return this.bookModel.create({
      ...createBookDto,
      id: 0
    });
  }

  async findAll(page: number = 1, limit: number = 10) {
    const offset = (page - 1) * limit;

    const { rows, count } = await this.bookModel.findAndCountAll({
      limit: limit,
      offset: offset,
    });

    const totalPages = Math.ceil(count / limit);

    return {
      data: rows,
      meta: {
        totalItems: count,
        totalPages,
        currentPage: page,
        itemsPerPage: limit,
      },
    };
  }

  async findOne(id: number): Promise<Book> {
    const book = await this.bookModel.findByPk(id);
    if (!book) {
      throw new NotFoundException(`Book ID ${id} not found`);
    }
    return book;
  }

  async update(id: number, updateBookDto: UpdateBookDto): Promise<Book> {
    const [numberOfAffectedRows, [updatedBook]] = await this.bookModel.update(
      { ...updateBookDto },
      { where: { id }, returning: true }
    );

    if (numberOfAffectedRows === 0) {
      throw new NotFoundException(`Book ID ${id} not found`);
    }
    
    return updatedBook;
  }

  async remove(id: number): Promise<void> {
    const affectedRows = await this.bookModel.destroy({ where: { id } });

    if (affectedRows === 0) {
        throw new NotFoundException(`Book ID ${id} not found`);
    }
  }

  async updateCoverKey(id: number, coverKey: string): Promise<Book> {
    const book = await this.findOne(id);
    book.coverKey = coverKey;
    return await book.save();
  }
}