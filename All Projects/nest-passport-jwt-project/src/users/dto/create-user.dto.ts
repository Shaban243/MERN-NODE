import { IsBoolean, IsEmail, IsEmpty, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateUserDto {

    @IsNumber()
    id: number;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsNotEmpty()
    address: string;

    @IsBoolean()
    @IsNotEmpty()
    isActive: true;

    @IsString()
    @IsNotEmpty()
    role: string
}
