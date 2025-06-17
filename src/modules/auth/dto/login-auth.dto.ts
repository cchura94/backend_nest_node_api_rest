import { IsEmail, IsNotEmpty, MaxLength, MinLength } from "class-validator";
import { User } from "../interfaces/user.interface";
import { ApiProperty } from "@nestjs/swagger";

export class LoginAuthDto implements User{

    @ApiProperty({description: 'Ingrese un Correo válido', default: "juan@mail.com", example: "user@email.com"})
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty()
    @MinLength(6)
    @MaxLength(25)
    @IsNotEmpty()
    password: string;   
}