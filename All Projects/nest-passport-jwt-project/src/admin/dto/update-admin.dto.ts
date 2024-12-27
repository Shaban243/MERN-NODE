import { PartialType } from '@nestjs/swagger';
import { CreateAdminDto } from './create-admin.dto';
import { Role } from 'src/auth/roles.enum';

export class UpdateAdminDto extends PartialType(CreateAdminDto) {

    name: string;
    email: string;
    password: string;
    address: string;
    isActive: number;
    role: Role
  }


  