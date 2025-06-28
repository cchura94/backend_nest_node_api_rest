import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Contacto } from '../entities/contacto.entity';
import { Repository } from 'typeorm';
import { EntidadComercial } from '../entities/entidad-comercial.entity';
import { CreateContactoDto } from '../dto/create-contacto.dto';

@Injectable()
export class ContactoService {
    constructor(
        @InjectRepository(Contacto)
        private readonly contactoRepo: Repository<Contacto>,
        @InjectRepository(EntidadComercial)
        private readonly entidadRepo: Repository<EntidadComercial>
    ){}
    
    async create(createContactoDto: CreateContactoDto) {
      const entidad = this.entidadRepo.findOneBy({id: createContactoDto.entidad_comercial_id});
      if(!entidad) throw new NotFoundException('Entidad Comercial no encontrada');

      const contacto = this.contactoRepo.create({
        ...createContactoDto
      })
      return await this.contactoRepo.save(contacto)
    }
    
      async findAll() {
        return await this.contactoRepo.find();
      }
    
      async findOne(id: number) {
        const contacto = await this.contactoRepo.findOneBy({id})
        if(!contacto) throw new NotFoundException('COntacto no encontrado');
        return contacto;
      }
    
      async update(id: number, updateEntidadComercialDto: CreateContactoDto) {
        const contacto = await this.findOne(id);
        if(updateEntidadComercialDto.entidad_comercial_id){
            const entidad = this.entidadRepo.findOneBy({id: updateEntidadComercialDto.entidad_comercial_id});
            if(!entidad) throw new NotFoundException('Entidad Comercial no encontrada');
            // contacto.entidad_comercial = entidad;
        }
        Object.assign(contacto, updateEntidadComercialDto);
        return await this.contactoRepo.save(contacto);
      }
    
      async remove(id: number) {
        const contacto = await this.findOne(id);
        // contacto..activo = false;
        // await this.contactoRepo.remove(entidad);
      }
}
