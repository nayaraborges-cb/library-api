import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, UseInterceptors, UploadedFile, BadRequestException, UseGuards, ValidationPipe } from '@nestjs/common'
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { StorageService } from 'src/storage/storage.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from './models/user.model';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';

@UseGuards(AuthGuard, RolesGuard)
@Roles('admin')

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
    if (!file) {
      throw new BadRequestException('Nenhum arquivo avatar fornecido.');
    }

    const avatarUrl = await this.storageService.uploadFile(file, 'avatars'); 
    const user: User = await this.usersService.updateavatarKey(id, avatarUrl); 

    return {
      message: 'Avatar atualizado com sucesso!',
      avatarKey: user.avatarKey,
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
  create(
    @Body(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }))
    createUserDto: CreateUserDto
  ) {
    return this.usersService.create(createUserDto);
  }

    @Patch(':id')
    update(
      @Param('id') id: number,
      @Body(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },  
      }))
      updateUserDto: UpdateUserDTO
    ) {
      return this.usersService.update(id, updateUserDto);
    }


  @HttpCode(204)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.usersService.remove(+id);
  }
}
