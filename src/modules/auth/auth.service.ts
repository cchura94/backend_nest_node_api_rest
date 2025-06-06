import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../admin/users/entities/user.entity';
import { Repository } from 'typeorm';
import { compare } from "bcrypt"
import { LoginAuthDto } from './dto/login-auth.dto';

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ){}
    
    async login(credenciales: LoginAuthDto){

        const { email, password } = credenciales;

        // buscar usuario por email
        const usuario = await this.userRepository.findOne({where: {email: email}});
        if(!usuario){
            return new HttpException('Usuario no encontrado', 404);
        }
        
        const verificarPass = await compare(password, usuario.password)
        if(!verificarPass) 
            throw new HttpException('Contraseña Incorrecta', 401);

        return {user: usuario};
    }
}
