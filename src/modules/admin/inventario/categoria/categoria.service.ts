import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Categoria } from './entities/categoria.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriaService {

  constructor(
    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>
  ){}

  async create(createCategoriaDto: CreateCategoriaDto): Promise<Categoria> {
    const categoria = this.categoriaRepository.create(createCategoriaDto) ;
    return this.categoriaRepository.save(categoria);
  }

  /**
   * Esta función retorna la lista completa de categorias
   * @returns Listado de Categorias
   */
  findAll(): Promise<Categoria[]> {
    return this.categoriaRepository.find();
  }

  /**
   * Esta función retorna la categoria por id
   * Otro descripción
   * @param id id de categoria tipo number
   * @returns retorna la categoria filtrada
   */
  async findOne(id: number) {
    const categoria = await this.categoriaRepository.findOneBy({id});
    if(!categoria) throw new NotFoundException('La categoria no existe');
    return categoria;
  }

  async update(id: number, updateCategoriaDto: UpdateCategoriaDto) {
    const categoria = await this.findOne((id));
    this.categoriaRepository.merge(categoria, updateCategoriaDto);
    return this.categoriaRepository.save(categoria);
  }

  async remove(id: number) {
    const result = await this.categoriaRepository.delete(id);
   if(result.affected === 0) throw new NotFoundException('La Categoria no fue encontrada');
  }
}
