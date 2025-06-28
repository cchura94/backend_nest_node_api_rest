import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Producto } from './entities/producto.entity';
import { Categoria } from '../categoria/entities/categoria.entity';
import { Repository } from 'typeorm';
import { PaginatedProductoResponseDto } from './dto/paginated-producto-response.dto';

@Injectable()
export class ProductoService {

  constructor(
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>,

  ){}

  async create(createProductoDto: CreateProductoDto) {
    // verificar si la categoria existe
    const categoria = await this.categoriaRepository.findOne({where: {id: createProductoDto.categoriaId}}) 
    if(!categoria) throw new NotFoundException('Categoria no encontrada');

    const producto = this.productoRepository.create({ ...createProductoDto, categoria })
    return this.productoRepository.save(producto);
  }

  async subidaImagen(file: Express.Multer.File, id: number) {

    if(!file){
      throw new BadRequestException('No existe la Imagen');
    }

    // validar
    const valll = ['image/jpeg', 'image/png', 'image/jpg'];
    if(!valll.includes(file.mimetype)){
      throw new BadRequestException('Formato Invalido');
    }
    // validacion de tamaño de archivo
    const maxSize = 5 * 1024*1024
    if(file.size > maxSize){
      throw new BadRequestException('El archivo es muy grande');
    }

    const producto = await this.findOne(id);
    producto.imagen_url = file.path;
    this.productoRepository.save(producto);

    return {message: 'Archivo subido', filepath: file.path};
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    search: string = '',
    sortBy: string = 'id',
    order: 'ASC' | 'DESC' = 'ASC',
    almacen: number = 0,
    activo: boolean = true
  ): Promise<PaginatedProductoResponseDto> {
    const queryBuilder = this.productoRepository.createQueryBuilder('producto')
          .leftJoinAndSelect('producto.almacenes', 'almacen')
          .where('producto.nombre LIKE :search OR producto.marca LIKE :search', {
            search: `%${search}%`
          })
          .andWhere('producto.activo = :activo', {activo});

    // Filtro por almacen
    if(almacen) {
      queryBuilder.andWhere('almacen.id = :almacen', {almacen} );
    }

    // ordenación
    queryBuilder.orderBy(`producto.${sortBy}`, order);
    
    // paginación
    queryBuilder.skip((page - 1)*limit).take(limit);

    const [productos, total] = await queryBuilder.getManyAndCount();
    const totalPages = Math.ceil(total/limit);
    return {
      data: productos,
      total,
      limit,
      page,
      totalPages,
      activo,
      almacen,
      order,
      search,
      sortBy
    }
  }

  async findOne(id: number) {
    const producto = await this.productoRepository.findOne({where: {id }}) 
    if(!producto) throw new NotFoundException('Producto no encontrado');

    return producto;
  }

  async update(id: number, updateProductoDto: UpdateProductoDto) {
    const producto = await this.findOne(id)
    
    if(updateProductoDto.categoriaId){
      const categoria = await this.categoriaRepository.findOne({where: {id: updateProductoDto.categoriaId}}) 
      if(!categoria) throw new NotFoundException('Categoria no encontrada');
      producto.categoria = categoria;
    }
    Object.assign(producto, updateProductoDto);
    return this.productoRepository.save(producto);
  }

  async remove(id: number) {
    const producto = await this.findOne(id);
    producto.activo = false;
    
    await this.productoRepository.save(producto);
    
  }
}
