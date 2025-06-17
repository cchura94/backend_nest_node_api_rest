import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsEmail, IsOptional, IsString, IsUUID, Matches, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {

    @ApiProperty()
    @IsString()
    @MinLength(3)
    @MaxLength(20)
    username: string;

    // @Matches('[a-z0-9\-]+')
    @ApiProperty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsString()
    @MinLength(6)
    @MaxLength(200)
    password: string;

    @ApiProperty()
    @IsOptional()
    @IsArray()
    @IsUUID('4', {each: true})
    roleIds?: string[]

}
