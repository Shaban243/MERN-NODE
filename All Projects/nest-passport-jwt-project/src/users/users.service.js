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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const client_cognito_identity_provider_1 = require("@aws-sdk/client-cognito-identity-provider");
const typeorm_1 = require("@nestjs/typeorm");
const bcrypt = require("bcryptjs");
const user_entity_1 = require("./entities/user.entity");
const typeorm_2 = require("typeorm");
const product_entity_1 = require("../products/entities/product.entity");
const aws_config_1 = require("../../config/aws.config");
const aws_config_2 = require("../../config/aws.config");
const client_s3_1 = require("@aws-sdk/client-s3");
let UsersService = class UsersService {
    constructor(usersRepository, productsRepository) {
        this.usersRepository = usersRepository;
        this.productsRepository = productsRepository;
        this.cognito = new client_cognito_identity_provider_1.CognitoIdentityProviderClient({
            region: 'ap-south-1',
        });
    }
    async registerUser(createUserDto) {
        const { email, password, name, address, isActive, role } = createUserDto;
        if (createUserDto.role !== 'user') {
            throw new common_1.BadRequestException(`Invalid role: ${createUserDto.role}. Only users with the role "user" can be registered.`);
        }
        const params = {
            UserPoolId: process.env.COGNITO_USER_POOL_ID,
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
            const signUpCommand = new client_cognito_identity_provider_1.SignUpCommand(params);
            const signUpResponse = await this.cognito.send(signUpCommand);
            const adminUpdateParams = {
                UserPoolId: process.env.COGNITO_USER_POOL_ID,
                Username: params.Username,
                UserAttributes: [
                    { Name: 'email_verified', Value: 'true' },
                ],
            };
            const updateCommand = new client_cognito_identity_provider_1.AdminUpdateUserAttributesCommand(adminUpdateParams);
            await this.cognito.send(updateCommand);
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
            UserPoolId: aws_config_2.cognito_user_pool_id,
            ClientId: clientId,
            AuthParameters: {
                USERNAME: email,
                PASSWORD: password,
            },
        };
        const user = new client_cognito_identity_provider_1.AdminInitiateAuthCommand({
            AuthFlow: 'ADMIN_NO_SRP_AUTH',
            UserPoolId: aws_config_2.cognito_user_pool_id,
            ClientId: clientId,
            AuthParameters: {
                USERNAME: email,
                PASSWORD: password,
            },
        });
        try {
            const authResult = await aws_config_1.cognito.send(user);
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
    async createUser(createUserDto) {
        if (createUserDto.role !== 'user') {
            throw new common_1.BadRequestException(`Invalid role: ${createUserDto.role}. Only users with the role "user" can be created.`);
        }
        const params = {
            UserPoolId: process.env.COGNITO_USER_POOL_ID,
            Username: `user-${Date.now()}`,
            TemporaryPassword: createUserDto.password,
            UserAttributes: [
                { Name: 'name', Value: createUserDto.name },
                { Name: 'email', Value: createUserDto.email },
                { Name: 'email_verified', Value: 'true' },
                { Name: 'custom:address', Value: String(createUserDto.address) },
                { Name: 'custom:isActive', Value: createUserDto.isActive ? '1' : '0' },
                { Name: 'custom:role', Value: createUserDto.role },
            ],
        };
        console.log('Creating user with params:', JSON.stringify(params, null, 2));
        try {
            console.log('Sending request to Cognito to create user...');
            const createdUser = await this.cognito.send(new client_cognito_identity_provider_1.AdminCreateUserCommand(params));
            console.log('Cognito User Created:', createdUser);
            return {
                id: createdUser.User?.Username ?? '',
                name: createUserDto.name,
                email: createUserDto.email,
                role: createUserDto.role,
                password: createUserDto.password,
                address: createUserDto.address ?? '',
                isActive: createUserDto.isActive ?? true,
                image_url: '',
                products: [],
            };
        }
        catch (error) {
            console.error('Error during user creation:', error.message, error.stack);
            throw new common_1.ConflictException('Error creating user in Cognito: ' + error.message);
        }
    }
    async updateUserImage(userId, image_url) {
        await this.usersRepository.update(userId, { image_url: image_url });
    }
    async findAll() {
        try {
            const users = await this.getCognitoUserByRole('user');
            if (!users || users.length === 0) {
                return null;
            }
            const userList = users.map(user => ({
                id: user.Username || '',
                name: user.Attributes?.find(attr => attr.Name === 'name')?.Value || '',
                email: user.Attributes?.find(attr => attr.Name === 'email')?.Value || '',
                address: user.Attributes?.find(attr => attr.Name === 'address')?.Value || '',
                isActive: user.Attributes?.find(attr => attr.Name === 'custom:isActive')?.Value === '1',
                role: user.Attributes?.find(attr => attr.Name === 'custom:role')?.Value || '',
            }));
            console.log(userList);
            return userList;
        }
        catch (error) {
            console.error('Error retrieving users from Cognito:', error);
            throw new Error('Failed to retrieve users from Cognito');
        }
    }
    async getCognitoUserByRole(role) {
        try {
            const params = {
                UserPoolId: process.env.COGNITO_USER_POOL_ID,
            };
            const data = new client_cognito_identity_provider_1.ListUsersCommand(params);
            const response = await aws_config_1.cognito.send(data);
            const filteredUsers = response.Users?.filter(user => user.Attributes?.some(attr => attr.Name === 'custom:role' && attr.Value === role));
            return filteredUsers || [];
        }
        catch (error) {
            console.error(`Error fetching users by role (${role}) from Cognito:`, error);
            throw new Error('Failed to fetch users by role from Cognito');
        }
    }
    async findUserById(username) {
        const s3Client = new client_s3_1.S3Client({
            region: process.env.AWS_REGION,
        });
        try {
            const params = {
                UserPoolId: process.env.COGNITO_USER_POOL_ID,
                Username: username,
            };
            const userCommand = new client_cognito_identity_provider_1.AdminGetUserCommand(params);
            const response = await aws_config_1.cognito.send(userCommand);
            if (!response) {
                throw new common_1.NotFoundException(`User with username ${username} not found in Cognito`);
            }
            const userId = response.UserAttributes.find(attr => attr.Name === 'sub')?.Value;
            if (!userId) {
                throw new common_1.NotFoundException(`User's 'sub' ID not found in Cognito`);
            }
            const userProducts = await this.productsRepository.find({
                where: { userId },
                relations: ['users'],
            });
            let imageUrls = [];
            const listObjectsParams = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Prefix: `user/${userId}/`,
            };
            const command = new client_s3_1.ListObjectsV2Command(listObjectsParams);
            const { Contents } = await s3Client.send(command);
            if (Contents && Contents.length > 0) {
                imageUrls = Contents.map((file) => {
                    return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${file.Key}`;
                });
                console.log('All image URLs:', imageUrls);
            }
            else {
                console.log('No images found for this user');
            }
            return {
                user: response,
                imageUrls,
                products: userProducts,
            };
        }
        catch (error) {
            console.error('Error retrieving user from Cognito:', error);
            throw new Error('Failed to retrieve user from Cognito');
        }
    }
    async update(username, _updateUserDto) {
        try {
            const userAttributes = [];
            if (_updateUserDto.name) {
                userAttributes.push({
                    Name: 'name',
                    Value: String(_updateUserDto.name),
                });
            }
            if (_updateUserDto.email) {
                userAttributes.push({
                    Name: 'email',
                    Value: String(_updateUserDto.email),
                });
            }
            if (_updateUserDto.address) {
                userAttributes.push({
                    Name: 'custom:address',
                    Value: String(_updateUserDto.address),
                });
            }
            if (_updateUserDto.isActive) {
                userAttributes.push({
                    Name: 'custom:isActive',
                    Value: String(_updateUserDto.isActive),
                });
            }
            if (_updateUserDto.password) {
                await this.resetPassword(username, _updateUserDto.password);
            }
            if (userAttributes.length === 0) {
                throw new common_1.ConflictException('No attributes to update');
            }
            const params = {
                UserPoolId: process.env.COGNITO_USER_POOL_ID,
                Username: username,
                UserAttributes: userAttributes,
            };
            const command = new client_cognito_identity_provider_1.AdminUpdateUserAttributesCommand(params);
            const response = await aws_config_1.cognito.send(command);
            console.log(`User with username ${username} updated successfully`, response);
            return;
        }
        catch (error) {
            console.error('Error updating user', error);
            throw error;
        }
    }
    async remove(id) {
        try {
            const params = {
                UserPoolId: process.env.COGNITO_USER_POOL_ID,
                Username: id,
            };
            const command = new client_cognito_identity_provider_1.AdminDeleteUserCommand(params);
            const response = await aws_config_1.cognito.send(command);
            console.log(`User with ID ${id} deleted from Cognito`, response);
        }
        catch (error) {
            console.error('Error deleting user', error);
            throw error;
        }
    }
    async confirmUserSignup(username, newPassword, _userPoolId) {
        try {
            const userStatus = await this.getUserStatus(username, _userPoolId);
            if (userStatus === 'CONFIRMED') {
                console.log(`User ${username} is already confirmed.`);
                return;
            }
            if (userStatus === 'UNCONFIRMED') {
                await this.resetUserPassword(username, newPassword, _userPoolId);
                console.log(`User ${username} is now confirmed.`);
            }
            if (userStatus === 'FORCE_CHANGE_PASSWORD') {
                await this.resetUserPassword(username, newPassword, _userPoolId);
                console.log(`User ${username} password reset due to FORCE_CHANGE_PASSWORD.`);
            }
        }
        catch (error) {
            console.error('Error confirming user:', error.message);
            throw new Error('Error confirming user');
        }
    }
    async getUserStatus(username, _userPoolId) {
        const command = new client_cognito_identity_provider_1.AdminGetUserCommand({
            Username: username,
            UserPoolId: _userPoolId,
        });
        try {
            const data = await this.cognito.send(command);
            return data.UserStatus ?? '';
        }
        catch (error) {
            console.error('Error fetching user status:', error.message);
            throw new Error('Error fetching user status');
        }
    }
    async resetUserPassword(username, newPassword, _userPoolId) {
        try {
            const resetCommand = new client_cognito_identity_provider_1.AdminSetUserPasswordCommand({
                Username: username,
                UserPoolId: _userPoolId,
                Password: newPassword,
                Permanent: true,
            });
            await this.cognito.send(resetCommand);
            console.log(`Password reset for user: ${username}`);
        }
        catch (error) {
            console.error('Error resetting password for user:', error.message);
            throw new Error('Error resetting password');
        }
    }
    async resetPassword(id, newPassword) {
        try {
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            const params = {
                UserPoolId: process.env.COGNITO_USER_POOL_ID,
                Username: id,
                Password: hashedPassword,
                Permanent: true,
            };
            const command = new client_cognito_identity_provider_1.AdminSetUserPasswordCommand(params);
            await aws_config_1.cognito.send(command);
            console.log(`Password for user with id ${id} updated successfully`);
        }
        catch (error) {
            console.error('Error resetting password', error);
            throw new common_1.ConflictException('Failed to update password');
        }
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map