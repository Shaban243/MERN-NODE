import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class CognitoAuthGuard implements CanActivate {
    private cognitoClient;
    constructor();
    canActivate(context: ExecutionContext): Promise<boolean>;
}
