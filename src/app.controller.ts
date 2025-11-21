import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { BooksService } from './books/books.service';
import { UsersService } from './users/users.service';

@Controller()
export class AppController {

  constructor(
    private readonly appService: AppService,
    private readonly usersService: UsersService,
    private readonly booksService: BooksService, 
  ) {}

  @Get('books-list')
  listBooks(
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
  ) {
    return this.booksService.findAll(page, limit);
  }

  @Get('users-list')
  listUsers(
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
  ) {
    return this.usersService.findAll(page, limit);
  }

  @Get()
    findAll(
      @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
      @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
    ) {
      return this.usersService.findAll(page, limit);
    }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
