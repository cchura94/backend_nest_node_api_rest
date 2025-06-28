import { IsBoolean, IsEmail, IsIn, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateEntidadComercialDto {
    @IsIn(['cliente', 'proveedor'])
    tipo: 'cliente' | 'proveedor';

    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    razon_social: string;

    @IsOptional()
    @IsString()
    @MaxLength(100)
    ci_nit_ruc_rut?: string;

    @IsOptional()
    @IsString()
    @MaxLength(20)
    telefono?: string
    
    @IsOptional()
    @IsString()
    @MaxLength(255)
    direccion?: string;
    
    @IsOptional()
    @IsEmail()
    correo?: string;
    
    @IsBoolean()
    activo: boolean;
}
