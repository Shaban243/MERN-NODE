import { CreateAdminDto } from './create-admin.dto';
import { Role } from 'src/auth/roles.enum';
declare const UpdateAdminDto_base: import("@nestjs/common").Type<Partial<CreateAdminDto>>;
export declare class UpdateAdminDto extends UpdateAdminDto_base {
    name: any;
    email: any;
    password: any;
    address: any;
    isActive: any;
    role: Role;
}
export {};
