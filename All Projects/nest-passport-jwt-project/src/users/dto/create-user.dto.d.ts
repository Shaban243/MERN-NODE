import { Role } from 'src/auth/roles.enum';
export interface UserInterface {
    name: string;
    email: string;
    password: string;
    address: string;
    isActive: boolean;
    role?: Role;
}
export declare class CreateUserDto {
    name: string;
    email: string;
    password: string;
    address: string;
    isActive: boolean;
    role: Role;
}
export { Role };
