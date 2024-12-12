import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Admin } from './entities/admin.entity';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    createAdmin(createAdminDto: CreateAdminDto): Promise<Admin>;
    getAllAdmins(req: any): Promise<Admin[]>;
    getAdminById(id: string): Promise<Partial<Admin>>;
    updateAdmin(id: string, updateAdminDto: UpdateAdminDto): Promise<Partial<Admin>>;
    deleteAdmin(id: string): Promise<void>;
}
