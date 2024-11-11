import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('products')

export class Product {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @ManyToOne( () => User, user => user.products, { onDelete: 'SET NULL'})
    @JoinColumn({ name: 'userId'})
    user: User;
 

   
}
