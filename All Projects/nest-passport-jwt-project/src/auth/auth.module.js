"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../users/entities/user.entity");
const users_module_1 = require("../users/users.module");
const users_service_1 = require("../users/users.service");
const products_service_1 = require("../products/products.service");
const users_controller_1 = require("../users/users.controller");
const products_module_1 = require("../products/products.module");
const product_entity_1 = require("../products/entities/product.entity");
const admin_service_1 = require("../admin/admin.service");
const admin_module_1 = require("../admin/admin.module");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            admin_module_1.AdminModule,
            passport_1.PassportModule,
            users_module_1.UsersModule,
            products_module_1.ProductsModule,
            jwt_1.JwtModule.register({
                global: true,
                secret: process.env.JWT_SECRET_KEY,
                signOptions: { expiresIn: '1h' },
            }),
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.User, product_entity_1.Product, auth_service_1.AuthService]),
        ],
        controllers: [users_controller_1.UsersController],
        providers: [auth_service_1.AuthService, users_service_1.UsersService, products_service_1.ProductsService, admin_service_1.AdminService],
        exports: [users_service_1.UsersService, auth_service_1.AuthService],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map