import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
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
  SignUpCommand,
  ConfirmSignUpCommand,
  InternalErrorException,
} from '@aws-sdk/client-cognito-identity-provider';

import { CreateUserDto, UserInterface } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
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
import { GetObjectCommand, ListObjectsV2Command, S3Client, UploadPartCommand } from '@aws-sdk/client-s3';
import { config } from 'process';
import { UploadService } from 'services/upload.service';


@Injectable()
export class UsersService {
  private cognito: CognitoIdentityProviderClient;

  constructor(
    private readonly uploadService: UploadService,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,

  ) {

    this.cognito = new CognitoIdentityProviderClient({
      region: 'ap-south-1',

      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },

    });


  }









  // Function for registering the user in cognito
  async registerUser(
    createUserDto: CreateUserDto,
    file: Express.Multer.File
  ): Promise<any> {
    const { name, email, password, address } = createUserDto;

    try {

      const signUpCommand = new SignUpCommand({
        ClientId: process.env.COGNITO_CLIENT_ID,
        Username: email,
        Password: password,
        UserAttributes: [
          { Name: 'name', Value: createUserDto.name },
          { Name: 'email', Value: createUserDto.email },
          { Name: 'address', Value: createUserDto.address },
          { Name: 'custom:address', Value: String(createUserDto.address) },
          { Name: 'custom:isActive', Value: createUserDto.isActive ? '1' : '0' },
          { Name: 'custom:role', Value: createUserDto.role },
        ],

      });

      const signUpResponse = await this.cognito.send(signUpCommand);


      const getUserCommand = new AdminGetUserCommand({
        UserPoolId: process.env.COGNITO_USER_POOL_ID,
        Username: email,
      });

      const userResponse = await this.cognito.send(getUserCommand);

      const userAttributes = userResponse.UserAttributes.reduce((acc, attr) => {
        const key = attr.Name.startsWith('custom:')
          ? attr.Name.replace('custom:', '')
          : attr.Name;
        acc[key] = attr.Value;
        return acc;
      }, {});

      const userId = userResponse.Username;

      let image_url = null;

      if (file) {
        image_url = await this.uploadService.uploadFile(file, `user/${userId}`);
      }

      return {
        message: 'User registered successfully. Please check your email and verify your account!. The user details are:',
        id: userId,
        name: userAttributes['name'],
        email: userAttributes['email'],
        isActive: userAttributes['isActive'] || 'true',
        address: userAttributes['address'],
        image_url: image_url || null,
      };
    } catch (error) {
      console.error('Error registering user:', error);
      throw new InternalServerErrorException('Failed to register user in Cognito');
    }
  }






  // Function for confirming the user email
  async confirmEmail(email: string, confirmationCode: string): Promise<any> {

    const params = {
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: email,
      ConfirmationCode: confirmationCode,

    };

    try {

      console.log('Printing');

      const confirmSignUpCommand = new ConfirmSignUpCommand(params);
      console.log('ConfirmSignUpCommand is: ', confirmSignUpCommand);
      const response = await this.cognito.send(confirmSignUpCommand);

      console.log('Response from cognito confirmsignupCommand is: ', response);


      return { message: 'Email confirmed successfully!' };
    } catch (error) {

      console.error('Error confirming email:', error);
      console.error('Detailed error:', JSON.stringify(error, null, 2));

      if (error.name === 'ExpiredCodeException') {
        throw new error('The confirmation code has expired. Please request a new code!');
      } else if (error.name === 'CodeMismatchException') {
        throw new BadRequestException('The confirmation code is incorrect. Please check the code and try again.');
      }

      throw new BadRequestException('Email confirmation failed due to an unexpected error.');
    }

  }








  // Login function
  async login(loginDto: LoginInterface) {
    const { email, password } = loginDto;
    const clientSecret = process.env.COGNITO_CLIENT_SECRET;
    const clientId = process.env.COGNITO_CLIENT_ID;

    if (!email || !password) {
      throw new BadRequestException('Email and password are required');
    }

    if (!clientSecret || !clientId) {
      throw new BadRequestException(
        'Cognito clientId and clientSecret is missing.',
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


    try {

      const authResult = await cognito.send(user);

      if (!authResult.AuthenticationResult) {
        console.error('AuthenticationResult is undefined');
        throw new UnauthorizedException('Invalid login credentials');
      }

      if (authResult.ChallengeName === 'NEW_PASSWORD_REQUIRED') {
        return {
          session: authResult.Session,
          message: 'Please provide a new password to continue.',
        };

      }

      const accessToken = authResult.AuthenticationResult.AccessToken;

      if (!accessToken) {
        throw new UnauthorizedException('Access token not found in response');
      }

      return { accessToken };

    } catch (error) {
      console.error('Login failed:', error.message, error);

      if (error.code === 'NotAuthorizedException') {
        throw new UnauthorizedException('Invalid email or password');
      } else if (error.code === 'UserNotFoundException') {
        throw new NotFoundException('User does not exist');
      } else {
        throw new BadRequestException('Incorrect email or password:' + error.message);
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
        role: user.Attributes?.find(attr => attr.Name === 'custom:role')?.Value || ''
      }));

      console.log(userList);
      return userList;

    } catch (error) {
      console.error('Error retrieving users from Cognito:', error);
      throw new NotFoundException('Failed to retrieve users from Cognito');
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
      throw new NotFoundException('Failed to fetch users by role from Cognito');
    }
  }







  // Function for getting a user by username and their associated products
  async findUserById(username: string): Promise<any> {

    const s3Client = new S3Client({
      region: process.env.AWS_REGION,
    });

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

      let imageUrls = [];

      const listObjectsParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Prefix: `user/${userId}/`,
      };

      const command = new ListObjectsV2Command(listObjectsParams);
      const { Contents } = await s3Client.send(command);

      if (Contents && Contents.length > 0) {
        imageUrls = Contents.map((file) => {
          return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${file.Key}`;
        });

        console.log('All image URLs:', imageUrls);
      } else {
        console.log('No images found for this user');
      }

      return {
        user: response,
        imageUrls,
        products: userProducts,
      };
    } catch (error) {
      console.error('Error retrieving user from Cognito:', error);
      throw new BadRequestException('Failed to retrieve user from Cognito');
    }
  }







  // Function for updating a user by id
  async update(username: string, _updateUserDto: UpdateUserDto): Promise<User> {
    try {

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


      if (_updateUserDto.password) {
        await this.resetPassword(username, _updateUserDto.password);
      }


      if (userAttributes.length === 0) {
        throw new ConflictException('No attributes to update');
      }


      const params = {
        UserPoolId: process.env.COGNITO_USER_POOL_ID,
        Username: username,
        UserAttributes: userAttributes,
      };


      const command = new AdminUpdateUserAttributesCommand(params);
      const response = await cognito.send(command);

      console.log(`User with username ${username} updated successfully`, response);
      return;

    } catch (error) {
      console.error('Error updating user', error);
      throw new InternalServerErrorException('Failed to update user attributes.');

    }
  }






  // Function for deleting a user by id
  async remove(id: string): Promise<void> {

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
      throw new NotFoundException(`User with given id ${id} not found!`);
    }

  }










  // Function to confirm the user status in Cognito
  // async confirmUserSignup(
  //   username: string,
  //   newPassword: string,
  //   _userPoolId: string,
  // ): Promise<void> {

  //   try {
  //     const userStatus = await this.getUserStatus(username, _userPoolId);

  //     if (userStatus === 'CONFIRMED') {
  //       console.log(`User ${username} is already confirmed.`);
  //       return;
  //     }

  //     if (userStatus === 'UNCONFIRMED') {
  //       await this.resetUserPassword(username, newPassword, _userPoolId);
  //       console.log(`User ${username} is now confirmed.`);
  //     }

  //     if (userStatus === 'FORCE_CHANGE_PASSWORD') {
  //       await this.resetUserPassword(username, newPassword, _userPoolId);
  //       console.log(`User ${username} password reset due to FORCE_CHANGE_PASSWORD.`);
  //     }

  //   } catch (error) {
  //     console.error('Error confirming user:', error.message);
  //     throw new Error('Error confirming user');
  //   }
  // }







  // // Function to check if the user is in FORCE_CHANGE_PASSWORD or UNCONFIRMED state
  // async getUserStatus(username: string, _userPoolId: string): Promise<string> {

  //   const command = new AdminGetUserCommand({
  //     Username: username,
  //     UserPoolId: _userPoolId,
  //   });

  //   try {

  //     const data = await this.cognito.send(command);
  //     return data.UserStatus ?? '';
  //   } catch (error) {
  //     console.error('Error fetching user status:', error.message);
  //     throw new Error('Error fetching user status');
  //   }

  // }








  // // Function for resetting the password of cognito user
  // async resetUserPassword(
  //   username: string,
  //   newPassword: string,
  //   _userPoolId: string,
  // ): Promise<void> {

  //   try {

  //     const resetCommand = new AdminSetUserPasswordCommand({
  //       Username: username,
  //       UserPoolId: _userPoolId,
  //       Password: newPassword,
  //       Permanent: true,
  //     });

  //     await this.cognito.send(resetCommand);
  //     console.log(`Password reset for user: ${username}`);
  //   } catch (error) {
  //     console.error('Error resetting password for user:', error.message);
  //     throw new Error('Error resetting password');
  //   }

  // }







  // Function for resetting the user's password
  private async resetPassword(id: string, newPassword: string): Promise<void> {

    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10);

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


