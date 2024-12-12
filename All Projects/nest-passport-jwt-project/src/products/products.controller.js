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
exports.ProductsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const products_service_1 = require("./products.service");
const create_product_dto_1 = require("./dto/create-product.dto");
const update_product_dto_1 = require("./dto/update-product.dto");
const platform_express_1 = require("@nestjs/platform-express");
const upload_service_1 = require("../../services/upload.service");
const roles_decorator_1 = require("../auth/gurards/roles.decorator");
const roles_enum_1 = require("../auth/roles.enum");
const cognito_guard_1 = require("../auth/gurards/cognito.guard");
const roles_guard_1 = require("../auth/gurards/roles.guard");
let ProductsController = class ProductsController {
    constructor(productsService, uploadService) {
        this.productsService = productsService;
        this.uploadService = uploadService;
    }
    async createProduct(req, createProductDto) {
        const user = req.user;
        try {
            return await this.productsService.createProduct(createProductDto);
        }
        catch (error) {
            console.error('Error creating product', error.message);
            throw error;
        }
    }
    async createProductForUser(userId, createProductDto) {
        try {
            const product = this.productsService.createProductForUser(createProductDto, userId);
            return product;
        }
        catch (error) {
            console.error('Error creating the product', error.message);
            throw new common_1.ForbiddenException('Only superAdmin can create the product for user');
        }
    }
    async uploadProductImage(ProductId, file) {
        try {
            const image_url = await this.uploadService.uploadFile(file, `product/${ProductId}`);
            await this.productsService.updateProductImage(ProductId, image_url);
            return { image_url };
        }
        catch (error) {
            console.error(`Error uploading the image for product ID ${ProductId}:`, error.message);
            throw new common_1.InternalServerErrorException('Failed to upload product image');
        }
    }
    async findAll() {
        try {
            const products = await this.productsService.findAll();
            return products;
        }
        catch (error) {
            console.error('Error retrieving the products!', error.message);
            throw error;
        }
    }
    async findOne(id) {
        try {
            const product = await this.productsService.findOne(id);
            return product;
        }
        catch (error) {
            console.error(`Product with ID ${id} not found`, error.message);
            throw error;
        }
    }
    async update(id, updateProductDto) {
        try {
            const updatedProduct = await this.productsService.update(id, updateProductDto);
            return updatedProduct;
        }
        catch (error) {
            console.error(`Product with ID ${id} not found`, error.message);
            throw error;
        }
    }
    async remove(id) {
        try {
            const deletedProduct = await this.productsService.remove(id);
            return deletedProduct;
        }
        catch (error) {
            console.error(`Product with ID ${id} not found`, error.message);
            throw error;
        }
    }
};
exports.ProductsController = ProductsController;
__decorate([
    (0, common_1.Post)('createproduct'),
    (0, common_1.UseGuards)(cognito_guard_1.CognitoAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)([roles_enum_1.Role.SuperAdmin, roles_enum_1.Role.ProductAssistantAdmin]),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new product (Super-Admin && Product-Assistant Admin)' }),
    (0, swagger_1.ApiBody)({ type: create_product_dto_1.CreateProductDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Product created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Failed to create Product' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_product_dto_1.CreateProductDto]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "createProduct", null);
__decorate([
    (0, common_1.Post)('createProduct/:userId'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(cognito_guard_1.CognitoAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)([roles_enum_1.Role.SuperAdmin]),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new product for a specific user (Super-Admin)' }),
    (0, swagger_1.ApiParam)({
        name: 'userId',
        description: 'Product ID for whom the product is being created',
        type: String,
    }),
    (0, swagger_1.ApiBody)({ type: create_product_dto_1.CreateProductDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Product created successfully for the user' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Failed to create product for the user' }),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_product_dto_1.CreateProductDto]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "createProductForUser", null);
__decorate([
    (0, common_1.Post)(':id/uploadimage'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, common_1.UseGuards)(cognito_guard_1.CognitoAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)([roles_enum_1.Role.SuperAdmin, roles_enum_1.Role.ProductAssistantAdmin]),
    (0, swagger_1.ApiOperation)({ summary: 'Upload an image for a specific product (Super-Admin && Product-Assistant Admin)' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Product ID for which the image is being uploaded', type: String }),
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
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Failed to upload product image' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "uploadProductImage", null);
__decorate([
    (0, common_1.Get)('getAllProducts'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(cognito_guard_1.CognitoAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)([roles_enum_1.Role.SuperAdmin, roles_enum_1.Role.ProductAssistantAdmin]),
    (0, swagger_1.ApiOperation)({ summary: 'Retrieve a list of all products (Super-Admin access && Product-Assistant Admin access)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Products retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Failed to retrieve products' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('getProduct/:id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(cognito_guard_1.CognitoAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)([roles_enum_1.Role.SuperAdmin, roles_enum_1.Role.ProductAssistantAdmin]),
    (0, swagger_1.ApiOperation)({ summary: 'Retrieve a product by ID (Super-Admin access && Product-Assistant Admin access)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Product ID to retrieve', type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Product retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Product not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)('updateProduct/:id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(cognito_guard_1.CognitoAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)([roles_enum_1.Role.SuperAdmin, roles_enum_1.Role.ProductAssistantAdmin]),
    (0, swagger_1.ApiOperation)({ summary: 'Update a product by ID (Super-Admin access && Product-Assistant Admin access)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Product ID to update', type: String }),
    (0, swagger_1.ApiBody)({ type: update_product_dto_1.UpdateProductDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Product updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Product not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_product_dto_1.UpdateProductDto]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)('deleteProduct/:id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(cognito_guard_1.CognitoAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)([roles_enum_1.Role.SuperAdmin, roles_enum_1.Role.ProductAssistantAdmin]),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a product by ID (Super-Admin access && Product-Assistant Admin access)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Product ID to delete', type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Product deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Product not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "remove", null);
exports.ProductsController = ProductsController = __decorate([
    (0, common_1.Controller)('products'),
    __metadata("design:paramtypes", [products_service_1.ProductsService,
        upload_service_1.UploadService])
], ProductsController);
//# sourceMappingURL=products.controller.js.map