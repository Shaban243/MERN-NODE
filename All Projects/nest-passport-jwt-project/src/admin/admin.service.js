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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const client_cognito_identity_provider_1 = require("@aws-sdk/client-cognito-identity-provider");
const common_1 = require("@nestjs/common");
const roles_enum_1 = require("../auth/roles.enum");
const bcrypt = require("bcryptjs");
let AdminService = class AdminService {
    constructor() {
        this.cognito = new client_cognito_identity_provider_1.CognitoIdentityProviderClient({
            region: 'ap-south-1',
        });
    }
    async createAdmin(createAdminDto) {
        try {
            const existingAdmin = await this.getCognitoUserByRole(createAdminDto.role);
            if ((createAdminDto.role === roles_enum_1.Role.SuperAdmin || createAdminDto.role === roles_enum_1.Role.UserAssistantAdmin || createAdminDto.role === roles_enum_1.Role.ProductAssistantAdmin) &&
                existingAdmin) {
                throw new common_1.ConflictException(`A ${createAdminDto.role} already exists and cannot be created again.`);
            }
            if (!createAdminDto.email ||
                !createAdminDto.password ||
                !createAdminDto.role) {
                throw new common_1.BadRequestException('Missing required fields: email, password, or role.');
            }
            if (![roles_enum_1.Role.SuperAdmin, roles_enum_1.Role.UserAssistantAdmin, roles_enum_1.Role.ProductAssistantAdmin].includes(createAdminDto.role)) {
                throw new common_1.BadRequestException('Role must be one of the following: Super-Admin, User-Assistant-Admin, Product-Assistant-Admin.');
            }
            const params = {
                UserPoolId: process.env.COGNITO_USER_POOL_ID,
                Username: `admin-${Date.now()}`,
                TemporaryPassword: createAdminDto.password,
                UserAttributes: [
                    { Name: 'name', Value: createAdminDto.name },
                    { Name: 'email', Value: createAdminDto.email },
                    { Name: 'email_verified', Value: 'true' },
                    { Name: 'custom:address', Value: String(createAdminDto.address) },
                    { Name: 'custom:isActive', Value: createAdminDto.isActive ? '1' : '0' },
                    { Name: 'custom:role', Value: createAdminDto.role },
                ],
            };
            const createdAdmin = await this.cognito.send(new client_cognito_identity_provider_1.AdminCreateUserCommand(params));
            console.log('Admin successfully created:', createdAdmin);
            return {
                id: createdAdmin.User?.Username ?? '',
                name: createAdminDto.name,
                email: createAdminDto.email,
                role: createAdminDto.role,
                password: createAdminDto.password,
                address: createAdminDto.address ?? '',
                isActive: createAdminDto.isActive ?? true,
            };
        }
        catch (error) {
            console.error('Error creating admin:', error.message || error);
            throw new Error('Error creating admin: ' + error.message || error);
        }
    }
    async getCognitoUserByRole(role) {
        try {
            console.log('Checking if a user with the role exists:', role);
            if (!Object.values(roles_enum_1.Role).includes(role)) {
                throw new Error(`Invalid role: ${role}`);
            }
            const params = {
                UserPoolId: process.env.COGNITO_USER_POOL_ID,
            };
            const result = await this.cognito.send(new client_cognito_identity_provider_1.ListUsersCommand(params));
            const usersWithRole = result.Users?.filter(user => user.Attributes?.find(attr => attr.Name === 'custom:role' && attr.Value === role));
            return usersWithRole.length > 0 ? usersWithRole : null;
        }
        catch (error) {
            console.error('Error fetching users by role:', error.message);
            throw new Error('Error fetching users by role: ' + error.message);
        }
    }
    async getAllAdmins() {
        try {
            const params = {
                UserPoolId: process.env.COGNITO_USER_POOL_ID,
            };
            const response = await this.cognito.send(new client_cognito_identity_provider_1.ListUsersCommand(params));
            const admins = response.Users?.filter(user => {
                const role = user.Attributes?.find(attr => attr.Name === 'custom:role')?.Value;
                return role === roles_enum_1.Role.UserAssistantAdmin || role === roles_enum_1.Role.ProductAssistantAdmin;
            }).map(user => ({
                id: user.Username || '',
                name: user.Attributes?.find(attr => attr.Name === 'name')?.Value,
                email: user.Attributes?.find(attr => attr.Name === 'email')?.Value,
                address: user.Attributes?.find(attr => attr.Name === 'custom:address')?.Value || '',
                isActive: user.Attributes?.find(attr => attr.Name === 'custom:isActive')?.Value === '1',
                role: user.Attributes?.find(attr => attr.Name === 'custom:role')?.Value,
            })) || [];
            console.log('Admins fetched from congito user-pool :', admins);
            return admins;
        }
        catch (error) {
            console.error('Error retrieving admins from Cognito:', error);
            throw new Error('Failed to retrieve admins from Cognito');
        }
    }
    async getAdminById(id) {
        try {
            const params = {
                UserPoolId: process.env.COGNITO_USER_POOL_ID,
                Username: id,
            };
            const command = new client_cognito_identity_provider_1.AdminGetUserCommand(params);
            const response = await this.cognito.send(command);
            if (!response) {
                throw new common_1.NotFoundException(`Admin with given id ${id} not found`);
            }
            const role = response.UserAttributes?.find(attr => attr.Name === 'custom:role')?.Value;
            if (role === roles_enum_1.Role.SuperAdmin) {
                throw new common_1.ForbiddenException('Access to super admin is not allowed!');
            }
            return {
                id: response.Username || '',
                name: response.UserAttributes?.find(attr => attr.Name === 'name')?.Value,
                email: response.UserAttributes?.find(attr => attr.Name === 'email')?.Value,
                address: response.UserAttributes?.find(attr => attr.Name === 'address')?.Value,
                isActive: response.UserAttributes?.find(attr => attr.Name === 'custom:isActive')?.Value === '1',
                role: response.UserAttributes?.find(attr => attr.Name === 'custom:role')?.Value,
            };
        }
        catch (error) {
            console.error('Error retrieving admin from Cognito', error);
            throw new Error('Failed to retrieve admin from Cognito');
        }
    }
    async updateAdmin(id, updateAdminDto) {
        try {
            const admin = await this.getAdminById(id);
            if (!admin) {
                throw new common_1.NotFoundException(`Admin with given id ${id} not found`);
            }
            const userAttributes = [];
            if (updateAdminDto.name) {
                userAttributes.push({ Name: 'name', Value: updateAdminDto.name });
            }
            if (updateAdminDto.email) {
                userAttributes.push({ Name: 'email', Value: updateAdminDto.email });
                userAttributes.push({ Name: 'email_verified', Value: 'true' });
            }
            if (updateAdminDto.role) {
                userAttributes.push({ Name: 'custom:role', Value: updateAdminDto.role });
            }
            if (updateAdminDto.address) {
                userAttributes.push({ Name: 'custom:address', Value: updateAdminDto.address });
            }
            if (updateAdminDto.isActive) {
                userAttributes.push({ Name: 'custom:isActive', Value: String(updateAdminDto.isActive) });
            }
            if (userAttributes.length === 0) {
                throw new common_1.ConflictException('No attributes to update');
            }
            const params = {
                UserPoolId: process.env.COGNITO_USER_POOL_ID,
                Username: id,
                UserAttributes: userAttributes,
            };
            await this.cognito.send(new client_cognito_identity_provider_1.AdminUpdateUserAttributesCommand(params));
            if (updateAdminDto.password) {
                await this.resetPassword(id, updateAdminDto.password);
            }
            const updatedAdmin = await this.getAdminById(id);
            return {
                id: updatedAdmin.id,
                name: updateAdminDto.name || updatedAdmin.name,
                email: updateAdminDto.email || updatedAdmin.email,
                address: updateAdminDto.address || updatedAdmin.address,
                isActive: updateAdminDto.isActive !== undefined ? updateAdminDto.isActive : updatedAdmin.isActive,
                role: updateAdminDto.role || updatedAdmin.role,
            };
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
            await this.cognito.send(new client_cognito_identity_provider_1.AdminDeleteUserCommand(params));
            console.log(`Admin with ID ${id} deleted from Cognito`);
        }
        catch (error) {
            console.error('Error deleting admin', error);
            throw error;
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
            await this.cognito.send(new client_cognito_identity_provider_1.AdminSetUserPasswordCommand(params));
            console.log(`Password for user with id ${id} updated successfully`);
        }
        catch (error) {
            console.error('Error resetting password', error);
            throw new common_1.ConflictException('Failed to update password');
        }
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], AdminService);
//# sourceMappingURL=admin.service.js.map