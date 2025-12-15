import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import  * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { AuthResponseDto } from './auth.dto';
import { ConfigService } from '@nestjs/config';
import { UserAttributes } from 'src/users/models/user.model';
import { User } from 'src/users/models/user.model';

@Injectable()
export class AuthService {
    private jwtExpirationTimeInSeconds: number;
    private readonly logger = new Logger(AuthService.name);

    constructor (
        private readonly usersServices: UsersService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) {
        this.jwtExpirationTimeInSeconds = +this.configService.get<number>('JWT_EXPIRATION', 3600);
    }

   async signIn(username: string, password: string): Promise<AuthResponseDto>{
        const foundUser: User | null = await this.usersServices.findByUserName(username);

        this.logger.log(`[LOGIN DEBUG] Tentativa para: ${username}. Usuário encontrado: ${!!foundUser}`);

        if (!foundUser) {
            throw new UnauthorizedException('Credenciais inválidas!');
        }

        this.logger.log(`[LOGIN DEBUG] Senha enviada: ${password}`);
        this.logger.log(`[LOGIN DEBUG] Hash armazenado: ${foundUser.password}`);

        const isPasswordValid = await bcrypt.compare(password, foundUser.password);

        this.logger.log(`[LOGIN DEBUG] Resultado da comparação de senha: ${isPasswordValid}`);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Credenciais inválidas!')
        }

        const payload = { 
            sub: foundUser.id,
            name : foundUser.name, 
            role: foundUser.role,
        }; 

        const token = this.jwtService.sign(payload);

        return { token, expiresIn: this.jwtExpirationTimeInSeconds }
    }
}
