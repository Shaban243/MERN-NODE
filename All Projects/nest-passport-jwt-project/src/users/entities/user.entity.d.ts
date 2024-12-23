import { Role } from 'src/auth/roles.enum';
import { Product } from 'src/products/entities/product.entity';
export declare class User {
    id: string;
    name: string;
    email: string;
    password: string;
    address: string;
    isActive: boolean;
    role: Role;
    image_url: string;
    products: Product[];
}
