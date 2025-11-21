import { Module } from '@nestjs/common'
import { UsersService } from './users.service'
import { UsersController } from './users.controller'
import { MulterModule } from '@nestjs/platform-express'
import { StorageModule } from 'src/storage/storage.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
  imports: [
      StorageModule,
      MulterModule.register({
        dest:'/uploads',
      }),
    
    ],
})
export class UsersModule {}
