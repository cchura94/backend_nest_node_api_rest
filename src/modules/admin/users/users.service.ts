import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User) 
    private usersRepository: Repository<User>
  ){}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, username, ...rest  } = createUserDto;

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

    const newUser = this.usersRepository.create({
      username, email, ...rest
    });

    return this.usersRepository.save(newUser)
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
