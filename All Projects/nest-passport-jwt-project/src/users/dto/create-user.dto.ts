import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export enum ERoles {
  Admin = 'admin',
  User = 'user',
}

export interface UserInterface {
  name: string;
  email: string;
  password: string;
  address: string;
  isActive: boolean;
  role?: ERoles;
}

export class CreateUserDto {

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsOptional()
  @IsBoolean()
  isActive: boolean;

  @IsOptional()
  @IsEnum(ERoles)
  role: ERoles;
}
