import { PartialType } from '@nestjs/swagger';
import { CreateAdminDto } from './create-admin.dto';
import { Role } from 'src/auth/roles.enum';

export class UpdateAdminDto extends PartialType(CreateAdminDto) {

    name: any;
    email: any;
    password: any;
    address: any;
    isActive: any;
    role: Role
  }


