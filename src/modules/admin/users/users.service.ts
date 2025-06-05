import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { In, Repository } from 'typeorm';
import * as bcrypt from "bcrypt"
import { Role } from '../roles/entities/role.entity';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User) 
    private usersRepository: Repository<User>,
    @InjectRepository(Role) 
    private rolesRepository: Repository<Role>
  ){}

  async create(createUserDto: CreateUserDto): Promise<any> {
    const { email, username, roleIds, ...rest  } = createUserDto;

    // Verificar si ya existe el username
    const existeUsername = await this.usersRepository.findOne({where:{username: username}});

    if(existeUsername){
      throw new BadRequestException(`El username "${username}" ya está en uso.`);
    }

    // Verificar si ya existe el email
    const existeEmail = await this.usersRepository.findOne({where:{email: email}});
    if(existeEmail){
      throw new BadRequestException(`El email "${email}" ya está en uso.`);
    }

    // roles
    let roles: Role[] =[];

    if(roleIds?.length){
      roles = await this.rolesRepository.find({where: {id: In(roleIds)}});
      console.log(roles);
      if(roles.length !== roleIds.length){
        throw new BadRequestException('Uno o más roles no son Válidos');
      }
    }

    console.log(roles);

    // encriptar
    const hashPassword = await bcrypt.hash(rest.password, 12)

    const newUser = this.usersRepository.create({
      username,
      email,
      password: hashPassword,
      roles
    });

    this.usersRepository.save(newUser)

    const { password, ...resto_datos } = newUser

    return resto_datos;
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({id});
    if(!user){
      throw new NotFoundException(`User con ID ${id} Not Found`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    Object.assign(user, updateUserDto);

    return this.usersRepository.save(user);
  }

  async remove(id: string) :Promise<void> {
    const result = await this.usersRepository.delete(id);
    if(result.affected === 0){
      throw new NotFoundException(`User con ID ${id} Not Found`);
    } 
  }
}
