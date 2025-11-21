import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import  * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { AuthResponseDto } from './auth.dto';
import { ConfigService } from '@nestjs/config';
import { UserAttributes } from 'src/users/models/user.model';

@Injectable()
export class AuthService {
    private jwtExpirationTimeInSeconds: number;

    constructor (
        private readonly usersServices: UsersService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) {
        this.jwtExpirationTimeInSeconds = +this.configService.get<number>('JWT_EXPIRATION', 3600);
    }

   async signIn(username: string, password: string): Promise<AuthResponseDto>{
        const foundUser: UserAttributes | undefined = await this.usersServices.findByUserName(username);

        if (!foundUser || (await bcrypt.compare(password, foundUser.password))) {
            throw new UnauthorizedException('Credenciais inválidas!');
        }

        const payload = { sub: foundUser.id, name : foundUser.name}; // Ver novamente na linha 11 do users.services.ts
        const token = this.jwtService.sign(payload);

        return { token, expiresIn: this.jwtExpirationTimeInSeconds }
    }
}
