import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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
import { AlmacenProducto } from '../inventario/almacen/entities/almacen_producto.entity';

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
    @InjectRepository(AlmacenProducto)
    private almacenProductoRep: Repository<AlmacenProducto>,
    
    
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
      ...createNotaDto,
      entidad_comercial: entidad,
      user: user
    });

    // guardar la nota primero para obtner el ID para movimientos
    await this.notaRepo.save(nota);

    const movimientosGuardados: Movimiento [] = [];

    for (const m of createNotaDto.movimientos) {
      const producto = await this.productoRepo.findOneBy({id: m.producto_id});
      if(!producto) throw new NotFoundException('Producto no encontrado')

        const almacen = await this.almacenRepo.findOneBy({id: m.almacen_id});
        if(!almacen) throw new NotFoundException('Almacen no encontrado');

        const movimiento = this.movRepo.create({
          ...m,
          nota: nota,
          producto,
          almacen
        });

        await this.actualizarStock(almacen, producto, m.cantidad, m.tipo_movimientos);

        const movGuardado = await this.movRepo.save(movimiento)
        movimientosGuardados.push(movGuardado);
       //  nota.movimientos.push(movimiento);  
    }

    nota.movimientos= movimientosGuardados;

    //const notaaa = await this.notaRepo.save(nota);
    return nota;
  }

  private async actualizarStock(almacen: Almacen, producto: Producto, cantidad: number, tipo: 'ingreso' | 'salida' | 'devolucion'){

    let ap = await this.almacenProductoRep.findOne({
      where: {
        almacen: {id: almacen.id},
        producto: {id: producto.id}
      },
      relations: ['almacen', 'producto']
    });

    if(!ap){
      if(tipo === 'salida'){
        throw new BadRequestException(`No hay stock registrado para este producto en este almacen`);
      }

      ap = this.almacenProductoRep.create({
        almacen, producto, cantidad_actual: cantidad, fecha_actualizacion: new Date()
      });

    }else{
      if(tipo === 'ingreso' || tipo === 'devolucion'){
        ap.cantidad_actual += cantidad;
      }else if(tipo === 'salida'){
        if(ap.cantidad_actual < cantidad) {
          throw new BadRequestException(`Stock insuficiente para la salida`);
        }
        ap.cantidad_actual -= cantidad;
      }
      ap.fecha_actualizacion = new Date()
    }

    await this.almacenProductoRep.save(ap);

  }

  findAll() {
    return `This action returns all nota`;
  }

  findOne(id: number) {
    return this.notaRepo.findOne({
      where: {id},
      relations: ['movimientos']
    });
  }

  update(id: number, updateNotaDto: UpdateNotaDto) {
    return `This action updates a #${id} nota`;
  }

  remove(id: number) {
    return `This action removes a #${id} nota`;
  }
}
