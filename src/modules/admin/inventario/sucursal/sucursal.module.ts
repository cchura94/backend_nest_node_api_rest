import { Module } from '@nestjs/common';
import { SucursalService } from './sucursal.service';
import { SucursalController } from './sucursal.controller';
import { Sucursal } from './entities/sucursal.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([Sucursal])],
  
  controllers: [SucursalController],
  providers: [SucursalService],
})
export class SucursalModule {}
