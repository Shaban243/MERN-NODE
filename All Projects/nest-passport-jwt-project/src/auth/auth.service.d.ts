import { LoginInterface } from './dto/login.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
export declare class AuthService {
    private readonly authService;
    private cognito;
    constructor(authService: AuthService);
    registerUser(createUserDto: CreateUserDto): Promise<any>;
    login(loginDto: LoginInterface): Promise<import("@aws-sdk/client-cognito-identity-provider").AuthenticationResultType | {
        session: string;
        message: string;
    }>;
}
