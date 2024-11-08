import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('users')

export class User {
  static username: string;
  static password: string;
  static find(arg0: (user: any) => boolean) {
    throw new Error('Method not implemented.');
  }

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

  @Column()
  role: string;

}