import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common'
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { StorageModule } from 'src/storage/storage.module';
import { StorageService } from 'src/storage/storage.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from './models/user.model';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly storageService: StorageService,  
  ) {}

  @Post(':id/avatar')
  @UseInterceptors(FileInterceptor('file'))

  async uploadAvatar(
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      throw new BadRequestException('Nenhum arquivo avatar fornecido.');
    }

    const avatarUrl = await this.storageService.uploadFile(file, 'avatars');
    const user: User = await this.usersService.updateAvatarUrl(id, avatarUrl);

    return {
      message: 'Avatar atualizado com sucesso!',
      avatarUrl: user.avatarUrl,
    };
  }

  @Get()
  findAll() {
    return this.usersService.findAll()
  }

 @Get(':id')
  findOne(@Param('id') id: number) {
    return this.usersService.findOne(Number (id));
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }


  @Patch(':id')
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDTO) {
    return this.usersService.update(+id, updateUserDto);
  }

  @HttpCode(204)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.usersService.remove(+id);
  }
}
