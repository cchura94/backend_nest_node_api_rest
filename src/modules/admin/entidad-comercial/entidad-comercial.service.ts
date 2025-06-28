import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEntidadComercialDto } from './dto/create-entidad-comercial.dto';
import { UpdateEntidadComercialDto } from './dto/update-entidad-comercial.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EntidadComercial } from './entities/entidad-comercial.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EntidadComercialService {

  constructor(
    @InjectRepository(EntidadComercial)
    private readonly entidadRepo: Repository<EntidadComercial>){}

  async create(createEntidadComercialDto: CreateEntidadComercialDto) {
    const entidad = this.entidadRepo.create(createEntidadComercialDto);
    return await this.entidadRepo.save(entidad)
  }

  async findAll() {
    return await this.entidadRepo.find({relations: ['contactos']});
  }

  async findOne(id: number) {
    const entidad = await this.entidadRepo.findOne({where: {id}, relations: ['contactos']})
    if(!entidad) throw new NotFoundException('Entidad Comercial no encontrada');
    return entidad;
  }

  async update(id: number, updateEntidadComercialDto: UpdateEntidadComercialDto) {
    const entidad = await this.findOne(id);
    const actualizado = Object.assign(entidad, updateEntidadComercialDto)
    return await this.entidadRepo.save(actualizado);
  }

  async remove(id: number) {
    const entidad = await this.findOne(id);
    entidad.activo = false;
    await this.entidadRepo.remove(entidad);
  }
}
