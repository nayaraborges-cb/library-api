import { Get, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { BookAttributes } from './models/book.model'; 
import { Book } from './models/book.model';

@Injectable()
export class BooksService {

  async updateCoverUrl(id: number, coverUrl: string): Promise<Book> {
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
  }

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
}
