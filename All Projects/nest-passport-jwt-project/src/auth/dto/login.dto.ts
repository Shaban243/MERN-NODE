import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export interface LoginInterface {
  email: string;
  password: string;
}

export class LoginDto implements LoginInterface {
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
