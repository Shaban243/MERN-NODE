import { IsOptional } from 'class-validator';
import { Role } from 'src/auth/roles.enum';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Admin {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  address: string;


  @Column()
  isActive: number;

  @Column({ type: 'enum', enum: Role })
  role: Role;
}
