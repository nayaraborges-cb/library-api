//import { PartialType } from '@nestjs/mapped-types';
//import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto {
    readonly name?: string
    readonly email?: string
    readonly password?: string
}
