import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";
import { User } from "../interfaces/user.interface";

export class RegisterAuthDto implements User{
    
    @IsString()
    @MinLength(3)
    @MaxLength(20)
    username: string;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    @MaxLength(200)
    password: string;
}