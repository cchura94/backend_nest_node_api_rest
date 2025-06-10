import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../admin/users/entities/user.entity';
import { Repository } from 'typeorm';
import { hash, compare } from "bcrypt"
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../admin/users/users.service';
import { RegisterAuthDto } from './dto/register-auth.dto';

@Injectable()
export class AuthService {

    constructor(
        private userService: UsersService,
        private jwtService: JwtService
    ){}
    
    async login(credenciales: LoginAuthDto){

        const { email, password } = credenciales;

        // buscar usuario por email
        const usuario = await this.userService.findOneByEmail(email);
        if(!usuario){
            return new HttpException('Usuario no encontrado', 404);
        }
        
        console.log(password, usuario.password);
        const verificarPass = await compare(password, usuario.password)

        if(!verificarPass) 
            throw new HttpException('Contraseña Incorrecta', 401);

        // JWT
        const payload = {username: usuario.username, id: usuario.id}

        const token = this.jwtService.sign(payload);

        return {access_token: token, user: usuario};
    }

    async register(objUser: RegisterAuthDto){
        // const { password } = objUser;
        // const plainToHash = await hash(password, 12);

        // objUser = {...objUser, password: plainToHash};
        return this.userService.create(objUser)
    }
}
