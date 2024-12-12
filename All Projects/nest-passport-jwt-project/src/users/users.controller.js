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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const users_service_1 = require("./users.service");
const create_user_dto_1 = require("./dto/create-user.dto");
const update_user_dto_1 = require("./dto/update-user.dto");
const roles_guard_1 = require("../auth/gurards/roles.guard");
const upload_service_1 = require("../../services/upload.service");
const platform_express_1 = require("@nestjs/platform-express");
const login_dto_1 = require("../auth/dto/login.dto");
const roles_enum_1 = require("../auth/roles.enum");
const cognito_guard_1 = require("../auth/gurards/cognito.guard");
const roles_decorator_1 = require("../auth/gurards/roles.decorator");
const confirm_user_dto_1 = require("./dto/confirm-user.dto");
let UsersController = class UsersController {
    constructor(usersService, uploadService) {
        this.usersService = usersService;
        this.uploadService = uploadService;
    }
    async register(createUserDto) {
        try {
            const result = await this.usersService.registerUser(createUserDto);
            console.log('User registration data is: ', result);
            return result;
        }
        catch (error) {
            console.error('Error during registration:', error.message);
            throw new common_1.InternalServerErrorException('User registration failed');
        }
    }
    async login(loginDto) {
        try {
            const token = await this.usersService.login(loginDto);
            return { token };
        }
        catch (error) {
            console.error('Error during login:', error.message);
            throw new common_1.InternalServerErrorException('Login failed');
        }
    }
    async createUser(createUserDto) {
        try {
            const createdUser = await this.usersService.createUser(createUserDto);
            return createdUser;
        }
        catch (error) {
            console.error('Error creating user:', error.message);
            throw new common_1.InternalServerErrorException('Failed to create user');
        }
    }
    async findAll(req) {
        try {
            console.log({ user: req.user });
            return this.usersService.findAll();
        }
        catch (error) {
            console.error('Error retrieving users:', error.message);
            throw error;
        }
    }
    async uploadUserImage(userId, file) {
        try {
            const imageUrl = await this.uploadService.uploadFile(file, `user/${userId}`);
            await this.usersService.updateUserImage(userId, imageUrl);
            return { imageUrl };
        }
        catch (error) {
            console.error(`Error uploading image for User ID ${userId}:`, error.message);
            throw new common_1.InternalServerErrorException('Failed to upload user image');
        }
    }
    async findOne(id) {
        try {
            const user = await this.usersService.findUserById(id);
            return user;
        }
        catch (error) {
            console.error(`Error finding the user with id ${id}`, error.message);
            throw error;
        }
    }
    async update(id, updateUserDto) {
        try {
            const updatedUser = await this.usersService.update(id, updateUserDto);
            return updatedUser;
        }
        catch (error) {
            console.error(`Error updating user with id ${id}`, error.message);
            throw error;
        }
    }
    async remove(id) {
        try {
            const deletedUser = await this.usersService.remove(id);
            console.log('deletedUser is: ', deletedUser);
            return deletedUser;
        }
        catch (error) {
            console.error(`Error deleting the user with id ${id}`, error.message);
            throw error;
        }
    }
    async confirmUser(username, confirmUserInput) {
        try {
            const userPoolId = process.env.COGNITO_USER_POOL_ID;
            const { newPassword } = confirmUserInput;
            await this.usersService.confirmUserSignup(username, newPassword, userPoolId);
            return { message: 'User confirmation successful.' };
        }
        catch (error) {
            console.error('Error confirming the status for user', error.message);
            throw error;
        }
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Post)('registerUser'),
    (0, swagger_1.ApiOperation)({ summary: 'Register a new user' }),
    (0, swagger_1.ApiBody)({ type: create_user_dto_1.CreateUserDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User registered successfully' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, swagger_1.ApiOperation)({ summary: 'Authenticate a user and return a JWT token' }),
    (0, swagger_1.ApiBody)({ type: login_dto_1.LoginDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User authenticated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('createUser'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(cognito_guard_1.CognitoAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)([roles_enum_1.Role.SuperAdmin, roles_enum_1.Role.UserAssistantAdmin]),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new user (Super-Admin access && Users-Assistant Admin access)' }),
    (0, swagger_1.ApiBody)({ type: create_user_dto_1.CreateUserDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'User created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Failed to create user' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "createUser", null);
__decorate([
    (0, common_1.Get)('getAllUsers'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(cognito_guard_1.CognitoAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)([roles_enum_1.Role.SuperAdmin, roles_enum_1.Role.UserAssistantAdmin]),
    (0, swagger_1.ApiOperation)({ summary: 'Retrieve all users (Super-Admin access && Users-Assistant Admin access)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'User list retrieved successfully' }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden: Only admin can retrieve users',
    }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Failed to create user' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(':id/uploadimage'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, swagger_1.ApiOperation)({ summary: 'Upload an image for a specific user' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'User ID to upload the image for',
        type: String,
    }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Image uploaded successfully' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Failed to upload image' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "uploadUserImage", null);
__decorate([
    (0, common_1.Get)('getUser/:id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(cognito_guard_1.CognitoAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)([roles_enum_1.Role.SuperAdmin, roles_enum_1.Role.UserAssistantAdmin]),
    (0, swagger_1.ApiOperation)({ summary: 'Get details of a specific user by ID (Super-Admin access && Users-Assistant Admin access)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'User ID to retrieve details', type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User details retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)('updateUser/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a specific user by ID (Super-Admin access && Users-Assistant Admin access)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'User ID to update', type: String }),
    (0, swagger_1.ApiBody)({ type: update_user_dto_1.UpdateUserDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)('deleteUser/:id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(cognito_guard_1.CognitoAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)([roles_enum_1.Role.SuperAdmin, roles_enum_1.Role.UserAssistantAdmin]),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a specific user by ID (Super-Admin access && Users-Assistant Admin access)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'User ID to delete', type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('confirm/:username'),
    (0, swagger_1.ApiOperation)({ summary: 'Confirm the confirmation status of user (Super-Admin access && Users-Assistant Admin access)' }),
    (0, swagger_1.ApiParam)({
        name: 'username',
        description: 'Confirm User Status',
        type: String,
    }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User Confirmation status successfully confirmed' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    __param(0, (0, common_1.Param)('username')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, confirm_user_dto_1.ConfirmUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "confirmUser", null);
exports.UsersController = UsersController = __decorate([
    (0, swagger_1.ApiTags)('Users'),
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        upload_service_1.UploadService])
], UsersController);
//# sourceMappingURL=users.controller.js.map