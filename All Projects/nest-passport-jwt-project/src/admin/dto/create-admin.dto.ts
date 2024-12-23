import { ApiProperty } from '@nestjs/swagger';
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

export class CreateAdminDto {

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @Matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
        message: 'Password must include at least 1 uppercase, 1 lowercase, 1 number, and 1 special character',
    })
    password: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    address: string;

    @ApiProperty({ default: 1 })
    @IsOptional()
    // @IsBoolean()
    isActive: number;

    @ApiProperty()
    @IsOptional()
    // @IsNotEmpty()
    @IsEnum(Role)
    role: Role;
}
