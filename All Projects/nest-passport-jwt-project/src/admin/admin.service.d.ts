import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Admin } from './entities/admin.entity';
import { Role } from 'src/auth/roles.enum';
export declare class AdminService {
    private cognito;
    constructor();
    createAdmin(createAdminDto: CreateAdminDto): Promise<Admin>;
    getCognitoUserByRole(role: Role): Promise<import("@aws-sdk/client-cognito-identity-provider").UserType[]>;
    getAllAdmins(): Promise<Admin[]>;
    getAdminById(id: string): Promise<Partial<Admin>>;
    updateAdmin(id: string, updateAdminDto: UpdateAdminDto): Promise<Partial<Admin>>;
    remove(id: string): Promise<void>;
    private resetPassword;
}
