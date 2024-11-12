import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ERoles } from '../dto/create-user.dto';
import { Product } from 'src/products/entities/product.entity';

@Entity('users')
export class User {
  // static username: string;
  // static password: string;
  // static find(arg0: (user: any) => boolean) {
  //   throw new Error('Method not implemented.');
  // }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  address: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'enum', enum: ERoles, default: ERoles.User })
  role: ERoles;

  @Column({ nullable: true})
  image_url: string;


  @OneToMany( () => Product, product => product.user, { cascade : true})
  products: Product[];

}
