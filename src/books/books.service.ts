import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './entities/book.entity';

@Injectable()
export class BooksService {
  private books: Book[] = [
   {
    id: 1,
    title: 'Dom Casmurro',
    author: 'Machado de Assis',
    genre: 'Romance',
    publication: 1899,
    resume: 'Um clássico da literatura brasileira',
   },
    
  ]
 

  findAll() {
    return this.books
  }

  findOne(id: number) {
    const book = this.books.find(book => book.id === id)
    if (!book) {
      throw new NotFoundException(`Book ID ${id} not found`)
    }
    return book
  }

   create(createBookDto: CreateBookDto) {
    this.books.push(createBookDto)
  }

  update(id: number, updateBookDto: UpdateBookDto) {
    const existingBook = this.findOne(id)
    if (existingBook as any) {
      const index = this.books.findIndex(book => book.id === id)
      this.books[index] = {
        id,
        ...updateBookDto,
      } as Book;
    }
  }

  remove(id: number) {
    const index = this.books.findIndex( book => book.id === id)
    if (index >= 0) {
      this.books.splice(index, 1)
    }
  }
}
