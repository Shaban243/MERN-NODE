import { User } from "src/users/entities/user.entity";
export declare class Product {
    id: string;
    name: string;
    description: string;
    image_url: string;
    userId: string;
    users: User[];
}
