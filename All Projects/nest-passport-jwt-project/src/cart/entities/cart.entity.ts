import { Product } from "src/products/entities/product.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Cart {

@PrimaryGeneratedColumn('uuid')
id: string;


@ManyToOne( () => User, (user) => user.cart, { onDelete: 'CASCADE' })
user: User;

@ManyToOne( () => Product, product => product.cart, { onDelete: 'CASCADE' })
product: Product;

@Column({ default: 1 })
quantity: number;

}
