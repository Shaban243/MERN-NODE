import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import {
  AdminInitiateAuthCommand,
  ListUsersCommand,
  AdminCreateUserCommand,
  AdminDeleteUserCommand,
  AdminGetUserCommand,
  AdminUpdateUserAttributesCommand,
  AdminSetUserPasswordCommand,
  CognitoIdentityProviderClient,
  AdminConfirmSignUpCommand,
  SignUpCommand,
} from '@aws-sdk/client-cognito-identity-provider';

import { CreateUserDto, UserInterface } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { LoginInterface } from 'src/auth/dto/login.dto';
import { Product } from 'src/products/entities/product.entity';
import { ProductsService } from 'src/products/products.service';
import * as crypto from 'crypto';
import { cognito } from 'config/aws.config';
import { cognito_user_pool_id } from 'config/aws.config';
import { CognitoUserPool } from 'amazon-cognito-identity-js';
import { Role } from 'src/auth/roles.enum';



@Injectable()
export class UsersService {
  private cognito: CognitoIdentityProviderClient;

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>
  ) {
    this.cognito = new CognitoIdentityProviderClient({
      region: 'ap-south-1',
    });

  }




  // Function for registering the user in cognito
  async registerUser(createUserDto: CreateUserDto): Promise<any> {
    const { email, password, name, address, isActive } = createUserDto;


    if (createUserDto.role !== 'user') {
      throw new BadRequestException(
        `Invalid role: ${createUserDto.role}. Only users with the role "user" can be registered.`
      );
    }

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
        { Name: 'custom:role', Value: createUserDto.role },
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
      UserPoolId: cognito_user_pool_id,
      ClientId: clientId,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
        // secretHash:'bnsl68vliht7dro0r3jehh94ktng97iog9e2ib86tp7leigpl4n'
      },
    };

    const user = new AdminInitiateAuthCommand({
      AuthFlow: 'ADMIN_NO_SRP_AUTH',
      UserPoolId: cognito_user_pool_id,
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






  // Helper function to generate the SECRET_HASH
  // private generateSecretHash(
  //   username: string,
  //   clientId: string,
  //   clientSecret: string,
  // ): string {
  //   const message = username + clientId;
  //   return crypto.createHmac('sha256', clientSecret).update(message).digest('base64');
  // }


  // function for getting a user by role
  // async getCognitoUserByRole(role: Role) {
  //   try {
  //     const params = {
  //       UserPoolId: process.env.COGNITO_USER_POOL_ID,
  //       Filter: `custom:role = "${role}"`,
  //     };

  //     const result = new ListUsersCommand(params);
  //     return result;
  //   } catch (error) {
  //     throw new Error('Error fetching users by role: ' + error.message);
  //   }
  // }






  // // Function for creating a new user
  async createUser(createUserDto: UserInterface): Promise<User> {

    if (createUserDto.role !== 'user') {
      throw new BadRequestException(
        `Invalid role: ${createUserDto.role}. Only users with the role "user" can be created.`
      );
    }
    const params = {
      UserPoolId: process.env.COGNITO_USER_POOL_ID,
      Username: `user-${Date.now()}`,
      TemporaryPassword: createUserDto.password,
      UserAttributes: [
        { Name: 'name', Value: createUserDto.name },
        { Name: 'email', Value: createUserDto.email },
        { Name: 'email_verified', Value: 'true' },
        { Name: 'custom:address', Value: String(createUserDto.address) },
        { Name: 'custom:isActive', Value: createUserDto.isActive ? '1' : '0' },
        { Name: 'custom:role', Value: createUserDto.role },
      ],
    };

    console.log('Creating user with params:', JSON.stringify(params, null, 2));

    try {

      console.log('Sending request to Cognito to create user...');
      const createdUser = await this.cognito.send(
        new AdminCreateUserCommand(params),
      );

      console.log('Cognito User Created:', createdUser);

      return {
        id: createdUser.User?.Username ?? '',
        name: createUserDto.name,
        email: createUserDto.email,
        role: createUserDto.role,
        password: createUserDto.password,
        address: createUserDto.address ?? '',
        isActive: createUserDto.isActive ?? true,
        image_url: '',
        products: [],
      };
    } catch (error) {
      console.error('Error during user creation:', error.message, error.stack);

      throw new ConflictException(
        'Error creating user in Cognito: ' + error.message,
      );

    }

  }





  // Function for updating User Image
  async updateUserImage(userId: string, image_url: string): Promise<void> {
    await this.usersRepository.update(userId, { image_url: image_url });
  }





  // Validate User
  // async validateUser(authPayload: LoginInterface): Promise<any> {
  //   const { email, password } = authPayload;

  //   try {
  //     const params = {
  //       AuthFlow: 'USER_PASSWORD_AUTH',
  //       ClientId: process.env.COGNITO_CLIENT_ID,
  //       AuthParameters: {
  //         USERNAME: email,
  //         PASSWORD: password,
  //       },
  //     };






  //     // Authenticate the user
  //     const authResult = await cognito
  //     console.log('Authentication Success:', authResult);

  //     const user = await this.getCognitoUserByRole(authResult.role);

  //     // Check if the user's role is 'Admin'
  //     const role = User.UserAttributes.find(attr => attr.Name === 'custom:role')?.Value;
  //     if (role !== 'Admin') {
  //       throw new UnauthorizedException('Access denied: Only admins are allowed.');
  //     }

  //     return user;
  //   } catch (error) {
  //     throw new UnauthorizedException('Incorrect email or password: ' + error.message);
  //   }

  // }








  // // Function for getting a list of all users
  async findAll(): Promise<any[]> {
    try {

      const users = await this.getCognitoUserByRole('user');

      if (!users || users.length === 0) {
        return null;
      }

      const userList = users.map(user => ({
        id: user.Username || '',
        name: user.Attributes?.find(attr => attr.Name === 'name')?.Value || '',
        email: user.Attributes?.find(attr => attr.Name === 'email')?.Value || '',
        address: user.Attributes?.find(attr => attr.Name === 'address')?.Value || '',
        isActive: user.Attributes?.find(attr => attr.Name === 'custom:isActive')?.Value === '1',
        role: user.Attributes?.find(attr => attr.Name === 'custom:role')?.Value || '',
      }));

      console.log(userList);
      return userList;

    } catch (error) {
      console.error('Error retrieving users from Cognito:', error);
      throw new Error('Failed to retrieve users from Cognito');
    }
  }





  // Function to fetch Cognito users by role
  async getCognitoUserByRole(role: string): Promise<any[]> {
    try {
      const params = {
        UserPoolId: process.env.COGNITO_USER_POOL_ID,
      };

      const data = new ListUsersCommand(params);
      const response = await cognito.send(data);

      const filteredUsers = response.Users?.filter(user =>
        user.Attributes?.some(attr => attr.Name === 'custom:role' && attr.Value === role)
      );

      return filteredUsers || [];
    } catch (error) {
      console.error(`Error fetching users by role (${role}) from Cognito:`, error);
      throw new Error('Failed to fetch users by role from Cognito');
    }
  }




  

// Function for getting a user by username and their associated products
async findUserById(username: string): Promise<any> {
  try {
    
    const params = {
      UserPoolId: process.env.COGNITO_USER_POOL_ID, 
      Username: username,  
    };

    
    const userCommand = new AdminGetUserCommand(params);
    const response = await cognito.send(userCommand);

    if (!response) {
   
      throw new NotFoundException(`User with username ${username} not found in Cognito`);
    }

    const userId = response.UserAttributes.find(attr => attr.Name === 'sub')?.Value;

    if (!userId) {
      throw new NotFoundException(`User's 'sub' ID not found in Cognito`);
    }

    const userProducts = await this.productsRepository.find({
      where: { userId },   
      relations: ['users'], 
    });

    return {
      user: response,
      products: userProducts, 
    };
    
  } catch (error) {
    console.error('Error retrieving user from Cognito:', error);
    throw new Error('Failed to retrieve user from Cognito');
  }

}






  // // Function for updating a user by id
  async update(id: string, _updateUserDto: UpdateUserDto): Promise<User> {

    try {
      const user = await this.findUserById(id);
      console.log(`User with given id ${id} is: `, user);

      if (!user)
        throw new NotFoundException(`User with given id ${id} not found`);

      const userAttributes = [];

      if (_updateUserDto.name) {
        userAttributes.push({
          Name: 'name',
          Value: String(_updateUserDto.name),
        });
      }


      if (_updateUserDto.email) {
        userAttributes.push({
          Name: 'email',
          Value: String(_updateUserDto.email),
        });
      }


      if (_updateUserDto.role) {
        userAttributes.push({
          Name: 'custom:role',
          Value: String(_updateUserDto.role),
        });
      }


      if (_updateUserDto.address) {
        userAttributes.push({
          Name: 'custom:address',
          Value: String(_updateUserDto.address),
        });
      }


      if (_updateUserDto.isActive) {
        userAttributes.push({
          Name: 'custom:isActive',
          Value: String(_updateUserDto.isActive),
        });
      }


      if (userAttributes.length === 0) {
        throw new ConflictException('No attributes to update');
      }


      const params = {
        UserPoolId: process.env.COGNITO_USER_POOL_ID,
        Username: id,
        UserAttributes: userAttributes,
      };

      const command = new AdminUpdateUserAttributesCommand(params);
      const response = await cognito.send(command);
      console.log(`User with id ${id} updated successfully`, response);

      if (_updateUserDto.password) {
        await this.resetPassword(id, _updateUserDto.password);
      }

      return user;

    } catch (error) {
      console.error('Error updating user', error);
      throw error;
    }

  }






  // Function for deleting a user by id
  async remove(id: string): Promise<void
  > {

    try {
      const params = {
        UserPoolId: process.env.COGNITO_USER_POOL_ID,
        Username: id,
      };

      const command = new AdminDeleteUserCommand(params);
      const response = await cognito.send(command);

      console.log(`User with ID ${id} deleted from Cognito`, response);
    } catch (error) {
      console.error('Error deleting user', error);
      throw error;
    }

  }










  // Function to confirm the user status in Cognito
  async confirmUserSignup(
    username: string,
    newPassword: string,
    _userPoolId: string,
  ): Promise<void> {

    try {
      const userStatus = await this.getUserStatus(username, _userPoolId);

      if (userStatus === 'CONFIRMED') {
        console.log(`User ${username} is already confirmed.`);
        return;
      }

      if (userStatus === 'UNCONFIRMED') {
        await this.resetUserPassword(username, newPassword, _userPoolId);
        console.log(`User ${username} is now confirmed.`);
      }

      if (userStatus === 'FORCE_CHANGE_PASSWORD') {
        await this.resetUserPassword(username, newPassword, _userPoolId);
        console.log(`User ${username} password reset due to FORCE_CHANGE_PASSWORD.`);
      }

    } catch (error) {
      console.error('Error confirming user:', error.message);
      throw new Error('Error confirming user');
    }
  }







  // Function to check if the user is in FORCE_CHANGE_PASSWORD or UNCONFIRMED state
  async getUserStatus(username: string, _userPoolId: string): Promise<string> {

    const command = new AdminGetUserCommand({
      Username: username,
      UserPoolId: _userPoolId,
    });

    try {

      const data = await this.cognito.send(command);
      return data.UserStatus ?? '';
    } catch (error) {
      console.error('Error fetching user status:', error.message);
      throw new Error('Error fetching user status');
    }

  }








  // Function for resetting the password of cognito user
  async resetUserPassword(
    username: string,
    newPassword: string,
    _userPoolId: string,
  ): Promise<void> {

    try {

      const resetCommand = new AdminSetUserPasswordCommand({
        Username: username,
        UserPoolId: _userPoolId,
        Password: newPassword,
        Permanent: true,  // Make sure the password reset is permanent
      });

      await this.cognito.send(resetCommand);
      console.log(`Password reset for user: ${username}`);
    } catch (error) {
      console.error('Error resetting password for user:', error.message);
      throw new Error('Error resetting password');
    }

  }







  // Function for resetting the user's password
  private async resetPassword(id: string, newPassword: string): Promise<void> {

    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10); // Hash the password before setting it

      const params = {
        UserPoolId: process.env.COGNITO_USER_POOL_ID,
        Username: id,
        Password: hashedPassword,
        Permanent: true,
      };

      const command = new AdminSetUserPasswordCommand(params);
      await cognito.send(command);
      console.log(`Password for user with id ${id} updated successfully`);
    } catch (error) {
      console.error('Error resetting password', error);
      throw new ConflictException('Failed to update password');
    }

  }


}


