import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNotaDto } from './dto/create-nota.dto';
import { UpdateNotaDto } from './dto/update-nota.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Nota } from './entities/nota.entity';
import { Repository } from 'typeorm';
import { Movimiento } from './entities/movimiento.entity';
import { User } from '../users/entities/user.entity';
import { Producto } from '../inventario/producto/entities/producto.entity';
import { Almacen } from '../inventario/almacen/entities/almacen.entity';
import { EntidadComercial } from '../entidad-comercial/entities/entidad-comercial.entity';

@Injectable()
export class NotaService {

  constructor(
    @InjectRepository(Nota)
    private notaRepo: Repository<Nota>,
    @InjectRepository(Movimiento)
    private movRepo: Repository<Movimiento>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Producto)
    private productoRepo: Repository<Producto>,
    @InjectRepository(Almacen)
    private almacenRepo: Repository<Almacen>,
    @InjectRepository(EntidadComercial)
    private entidadRepo: Repository<EntidadComercial>,
    
  ){

  }

  async create(createNotaDto: CreateNotaDto) {
    // trabajar con transacciones

    const user = await this.userRepo.findOneBy({id: createNotaDto.user_id}); 
    if(!user) throw new NotFoundException('Usuario no encontrado')

    // buscar la entidad-comercial
    const entidad = await this.entidadRepo.findOneBy({id: createNotaDto.entidad_comercial_id});
    if(!entidad) throw new NotFoundException('entidad comercial no encontrado')

    // crear la nota
    const nota  = await this.notaRepo.create({
      ...CreateNotaDto,
      entidad_comercial: entidad,
      user: user,
      movimientos: []
    });

    for (const m of createNotaDto.movimientos) {
      const producto = await this.productoRepo.findOneBy({id: m.producto_id});
      if(!producto) throw new NotFoundException('Producto no encontrado')

        const almacen = await this.almacenRepo.findOneBy({id: m.producto_id});
        if(!almacen) throw new NotFoundException('Almacen no encontrado');

        const movimiento = this.movRepo.create({
          ...m,
          producto,
          almacen
        });

        nota.movimientos.push(movimiento);  
    }

    return await this.notaRepo.save(nota);
  }

  findAll() {
    return `This action returns all nota`;
  }

  findOne(id: number) {
    return `This action returns a #${id} nota`;
  }

  update(id: number, updateNotaDto: UpdateNotaDto) {
    return `This action updates a #${id} nota`;
  }

  remove(id: number) {
    return `This action removes a #${id} nota`;
  }
}
