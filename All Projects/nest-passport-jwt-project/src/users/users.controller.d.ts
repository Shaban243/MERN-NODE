import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UploadService } from 'services/upload.service';
import { LoginDto } from 'src/auth/dto/login.dto';
import { ConfirmUserDto } from './dto/confirm-user.dto';
export declare class UsersController {
    private readonly usersService;
    private readonly uploadService;
    constructor(usersService: UsersService, uploadService: UploadService);
    register(createUserDto: CreateUserDto): Promise<any>;
    login(loginDto: LoginDto): Promise<{
        token: import("@aws-sdk/client-cognito-identity-provider").AuthenticationResultType | {
            session: string;
            message: string;
        };
    }>;
    createUser(createUserDto: CreateUserDto): Promise<User>;
    findAll(req: any): Promise<any[]>;
    uploadUserImage(userId: string, file: Express.Multer.File): Promise<{
        imageUrl: string;
    }>;
    findOne(id: string): Promise<User>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<User>;
    remove(id: string): Promise<void>;
    confirmUser(username: string, confirmUserInput: ConfirmUserDto): Promise<{
        message: string;
    }>;
}
