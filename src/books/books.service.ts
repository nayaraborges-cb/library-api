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





 /* async updateCoverKey(id: number, coverKey: string): Promise<Book> {
    return {} as Book;
  }

  findAll(page: number = 1, limit: number = 10) {
    const startIndex = (page -1) * limit;
    const endIndex = page * limit;
    const booksOnePage = this.books.slice(startIndex, endIndex);
    const totalItems = this.books.length;
    const totalPages = Math.ceil(totalItems / limit);

    return {
      data: booksOnePage,
      meta: {
        totalItems,
        totalPages,
        currentPage: page,
        itemsPerPage: limit,
      },
    };
  }

  private books: BookAttributes[] = [
   {
    id: 1,
    title: 'Dom Casmurro',
    author: 'Machado de Assis',
    genre: 'Romance',
    publication: 1899,
    resume: 'Um clássico da literatura brasileira',
   },
    
  ]
  booksService: any;


  findOne(id: number): BookAttributes { 

    const book = this.books.find(book => book.id === id)
    if (!book) {
      throw new NotFoundException(`Book ID ${id} not found`)
    }
    return book
  }

   create(createBookDto: CreateBookDto) {
 
    const newBook: BookAttributes = {
        id: this.books.length > 0 ? Math.max(...this.books.map(b => b.id)) + 1 : 1,
        ...createBookDto
    };
    this.books.push(newBook);
  

  update(id: number, updateBookDto: UpdateBookDto) {
    const existingBook = this.findOne(id)
    if (existingBook) { 
      const index = this.books.findIndex(book => book.id === id)
      this.books[index] = {
        id,
        ...updateBookDto,
      } as BookAttributes; 
    }
  }

  remove(id: number) {
    const index = this.books.findIndex( book => book.id === id)
    if (index >= 0) {
      this.books.splice(index, 1)
    }
  }
} */
