import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  name: any;
  email: any;
  password: any;
  address: any;
  isActive: any;
}





