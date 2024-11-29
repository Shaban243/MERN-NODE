import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { Role } from 'src/auth/roles.enum';

// export enum ERoles {
//   Admin = 'admin',
//   User = 'user',
// }

export interface UserInterface {
  name: string;
  email: string;
  password: string;
  address: string;
  isActive: boolean;
  role?: Role;
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
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message: 'Password must include at least 1 uppercase, 1 lowercase, 1 number, and 1 special character',
  })
  password: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsOptional()
  // @IsBoolean()
  isActive: boolean;

  @IsOptional()
  @IsEnum(Role)
  role: Role;
}


export { Role };
