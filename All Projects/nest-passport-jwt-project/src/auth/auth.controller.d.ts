import { CreateUserDto } from "src/users/dto/create-user.dto";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(createUserDto: CreateUserDto): Promise<any>;
    login(loginDto: LoginDto): Promise<{
        token: import("@aws-sdk/client-cognito-identity-provider").AuthenticationResultType | {
            session: string;
            message: string;
        };
    }>;
}
