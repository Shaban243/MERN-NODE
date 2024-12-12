"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const client_cognito_identity_provider_1 = require("@aws-sdk/client-cognito-identity-provider");
const aws_config_1 = require("../../config/aws.config");
const typeorm_1 = require("@nestjs/typeorm");
let AuthService = class AuthService {
    constructor(authService) {
        this.authService = authService;
    }
    async registerUser(createUserDto) {
        const { email, password, name, address, isActive } = createUserDto;
        if (createUserDto.role !== 'user') {
            throw new common_1.BadRequestException(`Invalid role: ${createUserDto.role}. Only users with the role "user" can be registered.`);
        }
        const params = {
            ClientId: process.env.COGNITO_CLIENT_ID,
            Username: `user-${Date.now()}`,
            Password: password,
            UserAttributes: [
                { Name: 'name', Value: createUserDto.name },
                { Name: 'email', Value: createUserDto.email },
                { Name: 'address', Value: createUserDto.address },
                { Name: 'custom:address', Value: String(createUserDto.address) },
                { Name: 'custom:isActive', Value: createUserDto.isActive ? '1' : '0' },
                { Name: 'custom:role', Value: createUserDto.role },
            ],
        };
        try {
            console.log('User params:', params);
            const command = new client_cognito_identity_provider_1.SignUpCommand(params);
            console.log('User command:', command);
            const response = await this.cognito.send(command);
            console.log('User registered:', response);
            return { message: 'Registration successful.' };
        }
        catch (error) {
            console.error('Error registering user:', error);
            console.error('Detailed error:', JSON.stringify(error, null, 2));
            throw new Error('Registration failed');
        }
    }
    async login(loginDto) {
        const { email, password } = loginDto;
        const clientSecret = process.env.COGNITO_CLIENT_SECRET;
        const clientId = process.env.COGNITO_CLIENT_ID;
        if (!email || !password) {
            throw new common_1.UnauthorizedException('Email and password are required');
        }
        if (!clientSecret || !clientId) {
            throw new Error('Cognito client configuration is missing. Ensure CLIENT_ID and CLIENT_SECRET are set in the environment.');
        }
        const params = {
            AuthFlow: 'ADMIN_NO_SRP_AUTH',
            UserPoolId: process.env.COGNITO_USER_POOL_ID,
            ClientId: clientId,
            AuthParameters: {
                USERNAME: email,
                PASSWORD: password,
            },
        };
        const user = new client_cognito_identity_provider_1.AdminInitiateAuthCommand({
            AuthFlow: 'ADMIN_NO_SRP_AUTH',
            UserPoolId: process.env.COGNITO_USER_POOL_ID,
            ClientId: clientId,
            AuthParameters: {
                USERNAME: email,
                PASSWORD: password,
            },
        });
        console.log('Auth Parameters:', params);
        try {
            const authResult = await aws_config_1.cognito.send(user);
            console.log('Login successful:', authResult);
            if (!authResult.AuthenticationResult) {
                console.error('AuthenticationResult is undefined');
                throw new common_1.UnauthorizedException('Invalid login credentials');
            }
            if (authResult.ChallengeName === 'NEW_PASSWORD_REQUIRED') {
                return {
                    session: authResult.Session,
                    message: 'Please provide a new password to continue.',
                };
            }
            else {
                return authResult.AuthenticationResult;
            }
        }
        catch (error) {
            console.error('Login failed:', error.message, error);
            if (error.code === 'NotAuthorizedException') {
                throw new common_1.UnauthorizedException('Invalid email or password');
            }
            else if (error.code === 'UserNotFoundException') {
                throw new common_1.UnauthorizedException('User does not exist');
            }
            else {
                throw new Error('An unexpected error occurred:' + error.message);
            }
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(AuthService)),
    __metadata("design:paramtypes", [AuthService])
], AuthService);
//# sourceMappingURL=auth.service.js.map