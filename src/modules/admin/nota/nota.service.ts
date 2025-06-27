import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateNotaDto } from './dto/create-nota.dto';
import { UpdateNotaDto } from './dto/update-nota.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Nota } from './entities/nota.entity';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { Movimiento } from './entities/movimiento.entity';
import { User } from '../users/entities/user.entity';
import { Producto } from '../inventario/producto/entities/producto.entity';
import { Almacen } from '../inventario/almacen/entities/almacen.entity';
import { EntidadComercial } from '../entidad-comercial/entities/entidad-comercial.entity';
import { AlmacenProducto } from '../inventario/almacen/entities/almacen_producto.entity';
import { FiltroNotaDto } from './dto/filtro-nota.dto';

@Injectable()
export class NotaService {

  constructor(
    @InjectDataSource()
    private readonly dataSource:DataSource,
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
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      const userRepo = queryRunner.manager.getRepository(User);
      const entidadRepo = queryRunner.manager.getRepository(EntidadComercial);
      const notaRepo = queryRunner.manager.getRepository(Nota);
      const productoRepo = queryRunner.manager.getRepository(Producto);
      const almacenRepo = queryRunner.manager.getRepository(Almacen);
      const movRepo = queryRunner.manager.getRepository(Movimiento);

      const user = await userRepo.findOneBy({id: createNotaDto.user_id}); 
      if(!user) throw new NotFoundException('Usuario no encontrado')

         // buscar la entidad-comercial
      const entidad = await entidadRepo.findOneBy({id: createNotaDto.entidad_comercial_id});
      if(!entidad) throw new NotFoundException('entidad comercial no encontrado')

        // crear la nota
    const nota  = await notaRepo.create({
      ...createNotaDto,
      entidad_comercial: entidad,
      user: user
    });
        // guardar la nota primero para obtner el ID para movimientos
        await notaRepo.save(nota);

        const movimientosGuardados: Movimiento [] = [];

        for (const m of createNotaDto.movimientos) {
          const producto = await productoRepo.findOneBy({id: m.producto_id});
          if(!producto) throw new NotFoundException('Producto no encontrado')
    
            const almacen = await almacenRepo.findOneBy({id: m.almacen_id});
            if(!almacen) throw new NotFoundException('Almacen no encontrado');
    
            const movimiento = movRepo.create({
              ...m,
              nota: nota,
              producto,
              almacen
            });
    
            await this.actualizarStockWithQueryRunner(queryRunner, almacen, producto, m.cantidad, m.tipo_movimientos);
    
            const movGuardado = await movRepo.save(movimiento)
            movimientosGuardados.push(movGuardado);
           //  nota.movimientos.push(movimiento);  
        }
    
        nota.movimientos= movimientosGuardados;

        await queryRunner.commitTransaction();

        return nota;

    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    }finally {
      await queryRunner.release();
    }

  
  }

  private async actualizarStockWithQueryRunner(queryRunner: QueryRunner, almacen: Almacen, producto: Producto, cantidad: number, tipo: 'ingreso' | 'salida' | 'devolucion'){

    const almacenProductoRep = queryRunner.manager.getRepository(AlmacenProducto);

    let ap = await almacenProductoRep.findOne({
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

      ap = almacenProductoRep.create({
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

    await almacenProductoRep.save(ap);

  }

  /*
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
    */

  async findAll(filtro: FiltroNotaDto) {
    const query = this.notaRepo.createQueryBuilder('nota')
                    .leftJoinAndSelect('nota.user', 'user')
                    .leftJoinAndSelect('nota.entidad_comercial', 'entidad')
                    .leftJoinAndSelect('nota.movimientos', 'movimientos')
                    .leftJoinAndSelect('movimientos.producto', 'producto');

    if(filtro.tipo_nota){
      query.andWhere('nota.tipo_nota = :tipo_nota', {tipo_nota: filtro.tipo_nota});
    }

    if(filtro.estado_nota){
      query.andWhere('nota.estado_nota = :estado_nota', {estado_nota: filtro.estado_nota});
    }

    if(filtro.desde){
      query.andWhere('nota.fecha_emision >= :desde', {desde: filtro.desde});
    }

    if(filtro.hasta){
      query.andWhere('nota.fecha_emision <= :hasta', {hasta: filtro.hasta});
    }
    

    if(filtro.user_id){
      query.andWhere('user.id = :user_id', {user_id: filtro.user_id});
    }

    if(filtro.entidad_comercial_id){
      query.andWhere('entidad.id = :entidad_comercial_id', {entidad_comercial_id: filtro.entidad_comercial_id});
    }

    query.orderBy('nota.fecha_emision', 'DESC');

    // Paginación
    const limit = filtro.limit || 10;
    const page = filtro.page || 1;

    query.skip((page - 1)*limit).take(limit);

    const [data, total] = await query.getManyAndCount();

    return {data, total};

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
