import { Module } from '@nestjs/common';
import { EntidadComercialService } from './entidad-comercial.service';
import { EntidadComercialController } from './entidad-comercial.controller';
import { ContactoService } from './contacto/contacto.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contacto } from './entities/contacto.entity';
import { EntidadComercial } from './entities/entidad-comercial.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Contacto, EntidadComercial])],
  controllers: [EntidadComercialController],
  providers: [EntidadComercialService, ContactoService],
})
export class EntidadComercialModule {}
