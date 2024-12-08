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

@Injectable()
export class CognitoAuthGuard implements CanActivate {
  private cognitoClient: CognitoIdentityProviderClient;

  constructor() {
    this.cognitoClient = new CognitoIdentityProviderClient({
      region: 'ap-south-1',
    });
  }

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization']?.replace('Bearer ', '');

    if (!token) {
      throw new ForbiddenException('Token is missing');
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

      request.user = { id: response.Username, ...userInfo };
      return true;
      
    } catch (error) {
      console.error('Error decoding token or fetching user:', error);
      throw new BadRequestException(error.message);
    }

  }

}
