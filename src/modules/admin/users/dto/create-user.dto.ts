import { IsArray, IsEmail, IsOptional, IsString, IsUUID, Matches, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {

    @IsString()
    @MinLength(3)
    @MaxLength(20)
    username: string;

    // @Matches('[a-z0-9\-]+')
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    @MaxLength(200)
    password: string;

    @IsOptional()
    @IsArray()
    @IsUUID('4', {each: true})
    roleIds?: string[]

}
