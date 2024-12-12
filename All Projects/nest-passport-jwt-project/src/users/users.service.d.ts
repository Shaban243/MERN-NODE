import { CreateUserDto, UserInterface } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { LoginInterface } from 'src/auth/dto/login.dto';
import { Product } from 'src/products/entities/product.entity';
export declare class UsersService {
    private readonly usersRepository;
    private readonly productsRepository;
    private cognito;
    constructor(usersRepository: Repository<User>, productsRepository: Repository<Product>);
    registerUser(createUserDto: CreateUserDto): Promise<any>;
    login(loginDto: LoginInterface): Promise<import("@aws-sdk/client-cognito-identity-provider").AuthenticationResultType | {
        session: string;
        message: string;
    }>;
    createUser(createUserDto: UserInterface): Promise<User>;
    updateUserImage(userId: string, image_url: string): Promise<void>;
    findAll(): Promise<any[]>;
    getCognitoUserByRole(role: string): Promise<any[]>;
    findUserById(username: string): Promise<any>;
    update(username: string, _updateUserDto: UpdateUserDto): Promise<User>;
    remove(id: string): Promise<void>;
    confirmUserSignup(username: string, newPassword: string, _userPoolId: string): Promise<void>;
    getUserStatus(username: string, _userPoolId: string): Promise<string>;
    resetUserPassword(username: string, newPassword: string, _userPoolId: string): Promise<void>;
    private resetPassword;
}
