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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const create_product_dto_1 = require("./dto/create-product.dto");
const typeorm_1 = require("@nestjs/typeorm");
const product_entity_1 = require("./entities/product.entity");
const typeorm_2 = require("typeorm");
const client_cognito_identity_provider_1 = require("@aws-sdk/client-cognito-identity-provider");
const aws_config_1 = require("../../config/aws.config");
const roles_enum_1 = require("../auth/roles.enum");
let ProductsService = class ProductsService {
    constructor(productsRepository) {
        this.productsRepository = productsRepository;
    }
    async createProductForUser(createProductDto, username) {
        try {
            const params = {
                UserPoolId: process.env.COGNITO_USER_POOL_ID,
                Username: username,
            };
            const command = new client_cognito_identity_provider_1.AdminGetUserCommand(params);
            const response = await aws_config_1.cognito.send(command);
            if (!response) {
                throw new common_1.NotFoundException(`User with username ${username} not found in Cognito`);
            }
            const userId = response.UserAttributes.find(attr => attr.Name === 'sub')?.Value;
            if (!userId) {
                throw new common_1.NotFoundException(`User's 'sub' ID not found in Cognito`);
            }
            const role = response.UserAttributes.find(attr => attr.Name === 'custom:role')?.Value;
            if (role !== roles_enum_1.Role.SuperAdmin) {
                throw new common_1.ForbiddenException('Only superAdmin can create the product for user');
            }
            const product = this.productsRepository.create({
                ...createProductDto,
                userId,
            });
            const savedProduct = await this.productsRepository.save(product);
            console.log('Saved Product:', savedProduct);
            return savedProduct;
        }
        catch (error) {
            console.error('Error creating the product:', error.message);
            throw new common_1.ForbiddenException('Only superAdmin can create the product for user');
        }
    }
    async createProduct(_createProductDto) {
        try {
            console.log('_createProductDto', create_product_dto_1.CreateProductDto);
            const product = this.productsRepository.create({ ..._createProductDto });
            console.log('product ', product);
            return await this.productsRepository.save(product);
        }
        catch (error) {
            console.error('Error creating product:', error);
            throw new Error('Failed to create product');
        }
    }
    async updateProductImage(ProductId, image_url) {
        try {
            await this.productsRepository.update(ProductId, { image_url });
            console.log(`Image URL updated for Product ID: ${ProductId}`);
        }
        catch (error) {
            console.error(`Error updating image URL for Product ID ${ProductId}:`, error.message);
            throw new common_1.InternalServerErrorException('Failed to update product image URL');
        }
    }
    async findAll() {
        try {
            const products = await this.productsRepository.find();
            console.log('All products data is: ', products);
            return products;
        }
        catch (error) {
            console.error('Error retrieving products: ', error);
            throw new Error('Failed to retrieve products');
        }
    }
    async findOne(id) {
        try {
            const product = await this.productsRepository.findOne({
                where: { id },
                relations: ['users'],
            });
            if (!product) {
                throw new common_1.NotFoundException(`Product with given id ${id} not found!`);
            }
            console.log(`Product found:`, product);
            return {
                product: product,
            };
        }
        catch (error) {
            console.error('Error finding product and user:', error);
            throw error;
        }
    }
    async update(id, _updateProductDto) {
        try {
            const product = await this.findOne(id);
            console.log(`Product with given id ${id} is: `, product);
            if (!product)
                throw new common_1.NotFoundException(`Product with given id ${id} not found!`);
            const updatedProduct = Object.assign(product, _updateProductDto);
            console.log(`Updated Product with given id ${id} is: `, updatedProduct);
            return this.productsRepository.save(updatedProduct);
        }
        catch (error) {
            console.error('Error updating product:', error);
            throw error;
        }
    }
    async remove(id) {
        try {
            const product = await this.productsRepository.findOne({ where: { id } });
            if (!product)
                throw new common_1.NotFoundException(`Product with given id ${id} not found!`);
            const deletedProduct = await this.productsRepository.remove(product);
            console.log('The deleted product is: ', deletedProduct);
            return deletedProduct;
        }
        catch (error) {
            console.error('Error Deleting product:', error);
            throw error;
        }
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ProductsService);
//# sourceMappingURL=products.service.js.map