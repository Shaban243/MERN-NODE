import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginInterface } from './dto/login.dto';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AdminInitiateAuthCommand, CognitoIdentityProviderClient, SignUpCommand } from '@aws-sdk/client-cognito-identity-provider';
import { cognito } from 'config/aws.config';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {

  private cognito: CognitoIdentityProviderClient;


  constructor(
    // private jwtService: JwtService,
    @InjectRepository(AuthService)
    private readonly authService: AuthService,
    
  ) {}

  // async login(authPayload: LoginInterface): Promise<any> {
  //   const user = await this.userService.validateUser(authPayload);
  //   const { password, ...result } = user;
    
  //   return this.jwtService.sign(result);
  // }








   // Function for registering the user in cognito
   async registerUser(createUserDto: CreateUserDto): Promise<any> {
    const { email, password, name, address, isActive } = createUserDto;


    const params = {
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: `user-${Date.now()}`,
      Password: password,
      UserAttributes: [
        { Name: 'name', Value: createUserDto.name },
        { Name: 'email', Value: createUserDto.email },
        { Name: 'address', Value: createUserDto.address },
        { Name: 'custom:address', Value: String(createUserDto.address) },
        { Name: 'custom:isActive', Value: createUserDto.isActive ? '1' : '0' },
      ],
    };

    try {

      console.log('User params:', params);
      const command = new SignUpCommand(params);
      console.log('User command:', command);
      const response = await this.cognito.send(command);

      console.log('User registered:', response);
      return { message: 'Registration successful.' };
    } catch (error) {
      console.error('Error registering user:', error);
      console.error('Detailed error:', JSON.stringify(error, null, 2));
      throw new Error('Registration failed');
    }

  }





  // Login function
  async login(loginDto: LoginInterface) {
    const { email, password } = loginDto;
    const clientSecret = process.env.COGNITO_CLIENT_SECRET;
    const clientId = process.env.COGNITO_CLIENT_ID;

    if (!email || !password) {
      throw new UnauthorizedException('Email and password are required');
    }

    if (!clientSecret || !clientId) {
      throw new Error(
        'Cognito client configuration is missing. Ensure CLIENT_ID and CLIENT_SECRET are set in the environment.',
      );
    }

    // const secretHash = this.generateSecretHash(email, clientId, clientSecret);

    const params = {
      AuthFlow: 'ADMIN_NO_SRP_AUTH',
      UserPoolId: process.env.COGNITO_USER_POOL_ID,
      ClientId: clientId,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
        // secretHash:'bnsl68vliht7dro0r3jehh94ktng97iog9e2ib86tp7leigpl4n'
      },
    };

    const user = new AdminInitiateAuthCommand({
      AuthFlow: 'ADMIN_NO_SRP_AUTH',
      UserPoolId: process.env.COGNITO_USER_POOL_ID,
      ClientId: clientId,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
      },
    });

    console.log('Auth Parameters:', params);

    try {

      const authResult = await cognito.send(user);
      console.log('Login successful:', authResult);

      if (!authResult.AuthenticationResult) {
        console.error('AuthenticationResult is undefined');
        throw new UnauthorizedException('Invalid login credentials');
      }

      if (authResult.ChallengeName === 'NEW_PASSWORD_REQUIRED') {
        return {
          session: authResult.Session,
          message: 'Please provide a new password to continue.',
        };

      } else {
        return authResult.AuthenticationResult;
      }
    } catch (error) {
      console.error('Login failed:', error.message, error);

      if (error.code === 'NotAuthorizedException') {
        throw new UnauthorizedException('Invalid email or password');
      } else if (error.code === 'UserNotFoundException') {
        throw new UnauthorizedException('User does not exist');
      } else {
        throw new Error('An unexpected error occurred:' + error.message);
      }

    }

  }


}
