import { IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateCategoriaDto {
    
    /**
     * Nombre Obligatorio
     */
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    nombre: string;

    @IsOptional()
    @IsString()
    descripcion?: string
}
