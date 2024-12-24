import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { Product } from 'src/products/entities/product.entity';
import { Role } from 'src/auth/roles.enum';
import { Cart } from 'src/cart/entities/cart.entity';

@Entity('users')
export class User {
 

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  address: string;

  @Column({ default: 1 })
  isActive: number;

  @Column({ type: 'enum', enum: Role, default: Role.User })
  role: Role;

  @Column({ nullable: true})
  image_url: string;


  @ManyToMany( () => Product, product => product.users, { cascade : true})
  @JoinTable({ name: 'User-Products' })
  products: Product[];

  @OneToMany( () => Cart, (cart) => cart.user)
  cart: Cart[];

}
