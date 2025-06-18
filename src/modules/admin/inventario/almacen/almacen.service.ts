import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAlmacenDto } from './dto/create-almacen.dto';
import { UpdateAlmacenDto } from './dto/update-almacen.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Almacen } from './entities/almacen.entity';
import { Repository } from 'typeorm';
import { Sucursal } from '../sucursal/entities/sucursal.entity';

@Injectable()
export class AlmacenService {

  constructor(
    @InjectRepository(Almacen)
    private readonly almacenRepository: Repository<Almacen>,
    @InjectRepository(Sucursal)
    private readonly sucursalRepository: Repository<Sucursal>
  ){}

  async create(createAlmacenDto: CreateAlmacenDto) {
    console.log(createAlmacenDto)
    const sucursal = await this.sucursalRepository.findOne({where: {id: createAlmacenDto.sucursal}});
    if(!sucursal) throw new NotFoundException('Sucursal no encontrada');

    const almacen = this.almacenRepository.create({...createAlmacenDto, sucursal});
    return await this.almacenRepository.save(almacen);
  }

  findAll(): Promise<Almacen[]> {
    return this.almacenRepository.find();
  }

  async findOne(id: number) {
    const almacen = await this.almacenRepository.findOne({where: {id: id}});
    if(!almacen) throw new NotFoundException('Almacen no encontrada');
    return almacen;
  }

  async update(id: number, updateAlmacenDto: UpdateAlmacenDto): Promise<Almacen> {
    const almacen = await this.findOne(id);
    if(updateAlmacenDto.sucursal){
      const sucursal = await this.sucursalRepository.findOne({where: {id: updateAlmacenDto.sucursal}});
      if(!sucursal) throw new NotFoundException('Sucursal no encontrada');
      almacen.sucursal = sucursal;
    }

    Object.assign(almacen, updateAlmacenDto);
    return this.almacenRepository.save(almacen);
  }

  async remove(id: number):Promise<void> {
    const almacen = await this.findOne(id);
    await this.almacenRepository.remove(almacen);
  }
}
