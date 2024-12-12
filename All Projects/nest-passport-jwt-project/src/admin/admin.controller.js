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
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const admin_service_1 = require("./admin.service");
const create_admin_dto_1 = require("./dto/create-admin.dto");
const update_admin_dto_1 = require("./dto/update-admin.dto");
const swagger_1 = require("@nestjs/swagger");
const roles_guard_1 = require("../auth/gurards/roles.guard");
const roles_decorator_1 = require("../auth/gurards/roles.decorator");
const roles_enum_1 = require("../auth/roles.enum");
const cognito_guard_1 = require("../auth/gurards/cognito.guard");
let AdminController = class AdminController {
    constructor(adminService) {
        this.adminService = adminService;
    }
    async createAdmin(createAdminDto) {
        try {
            const createdAdmin = await this.adminService.createAdmin(createAdminDto);
            return createdAdmin;
        }
        catch (error) {
            console.error('Error creating admin:', error.message);
            throw new common_1.InternalServerErrorException('Failed to create admin');
        }
    }
    async getAllAdmins(req) {
        try {
            console.log({ admin: req.admin });
            return this.adminService.getAllAdmins();
        }
        catch (error) {
            console.error('Error retrieving admins:', error.message);
            throw error;
        }
    }
    async getAdminById(id) {
        try {
            const admin = await this.adminService.getAdminById(id);
            return admin;
        }
        catch (error) {
            console.error(`Error finding the user with id ${id}`, error.message);
            throw error;
        }
    }
    async updateAdmin(id, updateAdminDto) {
        try {
            const updatedAdmin = await this.adminService.updateAdmin(id, updateAdminDto);
            return updatedAdmin;
        }
        catch (error) {
            console.error(`Error updating admin with id ${id}`, error.message);
            throw error;
        }
    }
    async deleteAdmin(id) {
        try {
            const deletedAdmin = await this.adminService.remove(id);
            return deletedAdmin;
        }
        catch (error) {
            console.error(`Error deleting the admin with id ${id}`, error.message);
            throw error;
        }
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Post)('createAdmin'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new admin (Super-Admin access only)' }),
    (0, swagger_1.ApiBody)({ type: create_admin_dto_1.CreateAdminDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Admin created successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_admin_dto_1.CreateAdminDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createAdmin", null);
__decorate([
    (0, common_1.Get)('getAllAdmins'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(cognito_guard_1.CognitoAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)([roles_enum_1.Role.SuperAdmin]),
    (0, swagger_1.ApiOperation)({ summary: 'Get all admins (Super-Admin access only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'All admins fetched successfully' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAllAdmins", null);
__decorate([
    (0, common_1.Get)('getAdminById/:id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(cognito_guard_1.CognitoAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)([roles_enum_1.Role.SuperAdmin]),
    (0, swagger_1.ApiOperation)({ summary: 'Get admin by ID (Super-Admin access only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Admin fetched successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAdminById", null);
__decorate([
    (0, common_1.Put)('updateAdmin/:id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(cognito_guard_1.CognitoAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)([roles_enum_1.Role.SuperAdmin]),
    (0, swagger_1.ApiOperation)({ summary: 'Update admin details (Super-Admin access only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Admin updated successfully' }),
    (0, swagger_1.ApiBody)({ type: update_admin_dto_1.UpdateAdminDto }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_admin_dto_1.UpdateAdminDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateAdmin", null);
__decorate([
    (0, common_1.Delete)('deleteAdmin/:id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(cognito_guard_1.CognitoAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)([roles_enum_1.Role.SuperAdmin]),
    (0, swagger_1.ApiOperation)({ summary: 'Delete admin (Super-Admin access only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Admin deleted successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteAdmin", null);
exports.AdminController = AdminController = __decorate([
    (0, common_1.Controller)('admin'),
    __metadata("design:paramtypes", [admin_service_1.AdminService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map