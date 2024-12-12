import { Repository } from 'typeorm';
import { Admin } from './entities/admin.entity';
export declare class AdminRepository extends Repository<Admin> {
    findByEmail(email: string): Promise<Admin | undefined>;
}
