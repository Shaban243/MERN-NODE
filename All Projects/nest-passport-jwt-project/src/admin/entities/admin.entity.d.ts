import { Role } from 'src/auth/roles.enum';
export declare class Admin {
    id: string;
    name: string;
    email: string;
    password?: string;
    address: string;
    isActive: boolean;
    role: Role;
}
