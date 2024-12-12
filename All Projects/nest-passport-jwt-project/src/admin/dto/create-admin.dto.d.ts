import { Role } from 'src/auth/roles.enum';
export declare class CreateAdminDto {
    name: string;
    email: string;
    password: string;
    address: string;
    isActive: boolean;
    role: Role;
}
