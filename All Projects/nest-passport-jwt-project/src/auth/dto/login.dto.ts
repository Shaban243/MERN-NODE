import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export interface LoginInterface {
  email: string;
  password: string;
}

export class LoginDto implements LoginInterface {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  password: string;
}
