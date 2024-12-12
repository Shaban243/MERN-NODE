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
exports.CognitoAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const client_cognito_identity_provider_1 = require("@aws-sdk/client-cognito-identity-provider");
let CognitoAuthGuard = class CognitoAuthGuard {
    constructor() {
        this.cognitoClient = new client_cognito_identity_provider_1.CognitoIdentityProviderClient({
            region: 'ap-south-1',
        });
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const token = request.headers['authorization']?.replace('Bearer ', '');
        if (!token) {
            throw new common_1.ForbiddenException('Token is missing');
        }
        try {
            const command = new client_cognito_identity_provider_1.GetUserCommand({
                AccessToken: token,
            });
            const response = await this.cognitoClient.send(command);
            const userAttributes = response.UserAttributes;
            const userInfo = userAttributes.reduce((acc, { Name, Value }) => {
                const key = Name.startsWith('custom:')
                    ? Name.replace('custom:', '')
                    : Name;
                acc[key] = Value;
                return acc;
            }, {});
            request.user = { id: response.Username, ...userInfo };
            return true;
        }
        catch (error) {
            console.error('Error decoding token or fetching user:', error);
            throw new common_1.BadRequestException(error.message);
        }
    }
};
exports.CognitoAuthGuard = CognitoAuthGuard;
exports.CognitoAuthGuard = CognitoAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], CognitoAuthGuard);
//# sourceMappingURL=cognito.guard.js.map