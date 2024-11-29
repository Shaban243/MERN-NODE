
    import { User } from "src/users/entities/user.entity";
    import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

    @Entity('products')

    export class Product {
        
        @PrimaryGeneratedColumn('uuid')
        id: string;

        @Column()
        name: string;

        @Column()
        description: string;

        @Column({ nullable: true})
        image_url: string;

        @Column({ nullable: true})
        userId: string;


        @ManyToMany( () => User, user => user.products, { onDelete: 'SET NULL'})
        users: User[];
    

    
    }
