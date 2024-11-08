import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsBoolean, IsEmail, IsEmpty, IsNotEmpty, IsNumber, IsString } from 'class-validator';


export class UpdateUserDto extends PartialType(CreateUserDto) {


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
    isActive: true;

    @IsString()
    @IsNotEmpty()
    role: string;




}
