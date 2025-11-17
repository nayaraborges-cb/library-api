import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  controllers: [BooksController],
  providers: [BooksService],
  imports: [
    MulterModule.register({
      dest:'/uploads',
    }),
  ],
})
export class BooksModule {}
