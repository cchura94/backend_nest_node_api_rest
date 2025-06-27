import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsDateString, IsDecimal, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Min } from "class-validator";

export class FiltroNotaDto {

    @ApiProperty()
    @IsOptional()
    @IsString()
    tipo_nota?: string; // 'compra' || 'venta'
       
    @ApiProperty()
    @IsOptional()
    @IsString()
    estado_nota?: string;

    @ApiProperty()
    @IsOptional()
    @IsDateString()
    desde?: string;

    @ApiProperty()
    @IsOptional()
    @IsDateString()
    hasta?: string;
     
    @ApiProperty()
    @IsOptional()
    @IsString()
    user_id?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    entidad_comercial_id?: string;

    @ApiProperty()
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit?: number;

    @ApiProperty()
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number;



}
