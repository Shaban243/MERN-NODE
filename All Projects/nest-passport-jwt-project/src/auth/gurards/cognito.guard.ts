import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as jwt from 'jsonwebtoken'; 
import {
  CognitoIdentityProviderClient,
  GetUserCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { cognito } from 'config/aws.config'; 
import { Role } from '../roles.enum';
import { Reflector } from '@nestjs/core';

@Injectable()
export class CognitoAuthGuard implements CanActivate {
  private cognitoClient: CognitoIdentityProviderClient;

  constructor( private reflector: Reflector) {
    this.cognitoClient = new CognitoIdentityProviderClient({
      region: 'ap-south-1',
    });
  }

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization']?.replace('Bearer ', '');

    if (!token) {
      throw new ForbiddenException('Access token is missing');
    }

    try {
      const command = new GetUserCommand({
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

      const userRole = userInfo['role'];
      request.user = { id: response.Username, role: userRole, ...userInfo };  

      const allowedRoles = this.reflector.get<string[]>(
        'roles',
        context.getHandler(),
      )

      if(allowedRoles && !allowedRoles.includes(userRole)) {
        throw new ForbiddenException(
          `You do not have permission to access this resource. Required roles: ${allowedRoles.join(
            ', ',
          )}`,
        );
      }

      return true;
      
    } catch (error) {
      console.error('Error decoding token or fetching user:', error);
      throw new BadRequestException(error.message);
    }

  }

}
