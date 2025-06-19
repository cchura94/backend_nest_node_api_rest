import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Producto } from './entities/producto.entity';
import { Categoria } from '../categoria/entities/categoria.entity';
import { Repository } from 'typeorm';

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

  findAll() {
    return this.productoRepository.find();
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
