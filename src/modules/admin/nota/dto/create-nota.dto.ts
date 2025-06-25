import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsDateString, IsDecimal, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateNotaDto {

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    codigo_nota: string;
        
    @ApiProperty()
    @IsDateString()
    fecha_emision: string;
        
    @ApiProperty()
    @IsString()
    tipo_nota: string; // 'compra' || 'venta' 
       
    @ApiProperty()
    @IsNumber()
    entidad_comercial_id: number;
     
    @ApiProperty()
    @IsString()
    @IsUUID('4', {each: true})
    user_id: string;
       
    @ApiProperty({required: false})
    @IsDecimal()
    @IsOptional()
    subtotal?: number;
        
    @ApiProperty({required: true})
    @IsDecimal()
    @IsOptional()
    impuestos?: number;
        
    @ApiProperty()
    @IsDecimal()
    @IsOptional()
    descuento_total?: number;
       
    @ApiProperty()
    @IsDecimal()
    total_calculado: number;
        
    @ApiProperty()
    @IsString()
    estado_nota: string;
       
    @ApiProperty({required: true})
    @IsString()
    @IsOptional()
    observaciones?: string;
        
    @ApiProperty()
    @IsArray()
    movimientos: MovimientoDto[]       

}


class MovimientoDto {
    
    @ApiProperty()
    @IsNumber()
    producto_id: number;
    
    @ApiProperty()
    @IsNumber()
    almacen_id: number;
    
    
    @ApiProperty()
    @IsNumber()
    cantidad: number;
    
    @ApiProperty()
    @IsString()
    tipo_movimientos: 'ingreso' | 'salida' | 'devolucion';
      
    @ApiProperty()
    @IsDecimal()
    precio_unitario_compra: number;
    
    @ApiProperty()
    @IsDecimal()
    precio_unitario_venta: number;
    
    @ApiProperty()
    @IsDecimal()
    total_linea: number;
    
    @ApiProperty()
    @IsString()
    @IsOptional()
    observaciones: string;

}