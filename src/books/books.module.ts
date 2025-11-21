import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { MulterModule } from '@nestjs/platform-express';
import { StorageModule } from 'src/storage/storage.module';

@Module({
  controllers: [BooksController],
  providers: [BooksService],
  exports: [BooksService],
  imports: [
    StorageModule,
    MulterModule.register({
      dest:'/uploads',
    }),
  
  ],
})
export class BooksModule {}
