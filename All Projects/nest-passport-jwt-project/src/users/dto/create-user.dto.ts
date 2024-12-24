import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { Role } from 'src/auth/roles.enum';


export interface UserInterface {
  name: string;
  email: string;
  password: string;
  address: string;
  isActive: boolean;
  role?: Role;
}

export class CreateUserDto {
  @ApiProperty({description: 'Name', required: true})
  @IsNotEmpty()
  @IsString()
  name: string;


  @ApiProperty({description: 'Email', required: true})
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;


  @ApiProperty({description: 'Password', required: true})
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message: 'Password must include at least 1 uppercase, 1 lowercase, 1 number, and 1 special character',
  })
  password: string;


  @ApiProperty({description: 'Address', required: true})
  @IsNotEmpty()
  @IsString()
  address: string;


  @IsOptional()
  @IsInt()
  @ApiProperty({ default: 1 }) // Default for a number
  isActive: number;


  @IsOptional()
  @IsString()
  image_url: string

  // @IsOptional()
  // @IsEnum(Role)
  // @ApiProperty()
  // role: Role;
}


export { Role };
