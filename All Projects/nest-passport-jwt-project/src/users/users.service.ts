import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  forwardRef,
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
  NotAuthorizedException,
  GetUserCommand,
} from '@aws-sdk/client-cognito-identity-provider';

import { CreateUserDto, UserInterface } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './entities/user.entity';
import { FindOptionsWhere, Not, Repository } from 'typeorm';
import { LoginInterface } from 'src/auth/dto/login.dto';
import { Product } from 'src/products/entities/product.entity';
import { ProductsService } from 'src/products/products.service';
import * as crypto from 'crypto';
import { cognito } from 'config/aws.config';
import { cognito_user_pool_id } from 'config/aws.config';
import { CognitoUserPool } from 'amazon-cognito-identity-js';
import { Role } from 'src/auth/roles.enum';
import { GetObjectCommand, ListObjectsV2Command, S3Client, UploadPartCommand } from '@aws-sdk/client-s3';
import { config, emit } from 'process';
import { UploadService } from 'services/upload.service';
import { create } from 'domain';
import { JwtService } from '@nestjs/jwt';
import { decode } from 'punycode';
import { AdminService } from 'src/admin/admin.service';
import { Admin } from 'src/admin/entities/admin.entity';
import * as jwt from 'jsonwebtoken';


@Injectable()
export class UsersService {
  private cognito: CognitoIdentityProviderClient;
  // adminRepository: any;

  constructor(

    private readonly uploadService: UploadService,
    private readonly jwtService: JwtService,
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,



    // @Inject(forwardRef(() => AdminService)) 
    // private readonly adminService: AdminService,



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
    imageFile: Express.Multer.File,
  ): Promise<{ message: string, User: any }> {

    const { email, password } = createUserDto;

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
          { Name: 'custom:isActive', Value: '1' },
          { Name: 'custom:role', Value: 'user' },
        ],
      });

      await this.cognito.send(signUpCommand);

      const getUserCommand = new AdminGetUserCommand({
        UserPoolId: process.env.COGNITO_USER_POOL_ID,
        Username: email,
      });

      await this.cognito.send(getUserCommand);

      // const userAttributes = userResponse.UserAttributes.reduce((acc, attr) => {
      //   const key = attr.Name.startsWith('custom:')
      //     ? attr.Name.replace('custom:', '')
      //     : attr.Name;
      //   acc[key] = attr.Value;
      //   return acc;
      // }, {});

      // const userId = userResponse.Username;




      let image_url = null;

      if (imageFile) {
        const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];
        const fileExtension = imageFile.originalname.split('.').pop()?.toLowerCase();

        if (!allowedExtensions.includes(fileExtension)) {
          throw new BadRequestException(
            'Invalid file type. Only image files (jpg, jpeg, png, gif) are allowed.',
          );
        }
      }

      if (imageFile) {
        image_url = await this.uploadService.uploadFile(imageFile);
      }


      const user = this.usersRepository.create({
        name: createUserDto.name,
        email: createUserDto.email,
        address: createUserDto.address,
        isActive: createUserDto['1'],
        role: createUserDto['user'],
        image_url: image_url || null,
      });



      const saltRounds = 10;
      user.password = await bcrypt.hash(createUserDto.password, saltRounds);

      const savedUser = await this.usersRepository.save(user);

      return {
        message: 'User registered successfully. Please check your email and verify your account!.',
        User: savedUser
        // savedUser: {
        //   id: savedUser.id,
        //   name: savedUser.name,
        //   email: savedUser.email,
        //   isActive: savedUser.isActive || 'true',
        //   address: savedUser.address,
        //   image_url: image_url || null,
        // },

        // id: userId,
        // name: userAttributes['name'],
        // email: userAttributes['email'],
        // isActive: userAttributes['isActive'] || 'true',
        // address: userAttributes['address'],
        // image_url: image_url || null,
      };
    } catch (error) {

      console.error('Error registering user:', error);

      if (error.name === 'UsernameExistsException') {
        throw new ConflictException('A user with this email already exists');
      }

      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to register user');
    }
  }







  // Function for confirming the user email
  async confirmEmail(email: string, confirmationCode: string): Promise<{ message: string }> {

    const params = {
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: email,
      ConfirmationCode: confirmationCode,

    };

    try {

      const confirmSignUpCommand = new ConfirmSignUpCommand(params);
      await this.cognito.send(confirmSignUpCommand);

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
  async login(loginDto: LoginInterface): Promise<{ userDetails: User | Admin, accessToken: string }> {

    try {

      const { email, password } = loginDto;

      const clientSecret = process.env.COGNITO_CLIENT_SECRET;
      const clientId = process.env.COGNITO_CLIENT_ID;


      if (!clientSecret || !clientId) {
        throw new BadRequestException(
          'Cognito clientId and clientSecret is missing.',
        );
      }


      const user = new AdminInitiateAuthCommand({

        AuthFlow: 'ADMIN_NO_SRP_AUTH',
        UserPoolId: process.env.COGNITO_USER_POOL_ID,
        ClientId: process.env.COGNITO_CLIENT_ID,
        AuthParameters: {
          USERNAME: email,
          PASSWORD: password,
        },

      });



      const authResult = await cognito.send(user);

      if (!authResult.AuthenticationResult) {
        console.error('AuthenticationResult is undefined');
        throw new UnauthorizedException('Invalid login credentials');
      }


      const accessToken = authResult.AuthenticationResult.AccessToken;

      if (!accessToken) {
        throw new UnauthorizedException('Access token not found in response');
      }

      let userDetails: User | Admin | null = await this.usersRepository.findOne({
        where: { email: email } as FindOptionsWhere<User>,
      });

      if (!userDetails) {
        userDetails = await this.adminRepository.findOne({
          where: { email: email } as FindOptionsWhere<Admin>,
        });
      }

      if (!userDetails) {
        throw new NotFoundException('User not found in the database');
      }


      return { userDetails, accessToken };

    } catch (error) {
      console.error('Login failed:', error);

      if (error instanceof ForbiddenException) {
        throw error;
      }

      if (error instanceof NotAuthorizedException) {
        throw error;
      }

      if (error instanceof BadRequestException) {
        throw error;
      }


      throw new InternalServerErrorException('Login failed due to an unexpected error');
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





  // Function for fetching the claims from access token
  async getClaims(accessToken: string) : Promise<{email: string, role: string}>{
    try {

      const decodedToken = jwt.decode( accessToken, { complete: true} ) as any; 

      if(!decodedToken || !decodedToken.payload) {
        throw new UnauthorizedException('Invalid access token!');
      }

      const email = decodedToken.payload.email;
      const role = decodedToken.payload.role;

      if(!email || !role) {
        throw new UnauthorizedException('Missing required claims in the access token!');
      }

      return { email, role }

    } catch (error) {
      
    }
  }




  // Function for fetching the user's profile
  async getUserProfile(email: string): Promise<any> {
    try {

      const user = await this.usersRepository.findOne({ where: { email: email } });

      if (!user) {
        const admin = await this.adminRepository.findOne({
          where: { email: email }
        });


        if (!admin) {
          throw new NotFoundException('User not found!');
        }

        return admin;
      }

      // const command = new GetUserCommand({
      //   AccessToken: accessToken,
      // });

      // const response = await cognito.send(command);

      // if (!response) {
      //   throw new UnauthorizedException('Invalid access token or session expired');
      // }

      // const userAttributes = response.UserAttributes.reduce((acc, attr) => {
      //   const key = attr.Name.startsWith('custom:') ? attr.Name.replace('custom:', '') : attr.Name;
      //   acc[key] = attr.Value;
      //   return acc;
      // }, {});

      // return {
      //   ...userAttributes,
      // };
      return user;

    } catch (error) {
      console.error('Error fetching user profile:', error);
      if (error.name === 'NotAuthorizedException') {
        throw new UnauthorizedException('Please log in to access your profile');
      }

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to fetch user profile');
    }
  }






  // // Function for getting a list of all users
  async findAll(): Promise<User[]> {
    try {

      // const users = await this.getCognitoUserByRole('user');

      // if (!users || users.length === 0) {
      //   return null;
      // }


      // const userList = users.map(user => ({
      //   id: user.Username || '',
      //   name: user.Attributes?.find(attr => attr.Name === 'name')?.Value || '',
      //   email: user.Attributes?.find(attr => attr.Name === 'email')?.Value || '',
      //   address: user.Attributes?.find(attr => attr.Name === 'address')?.Value || '',
      //   isActive: user.Attributes?.find(attr => attr.Name === 'custom:isActive')?.Value === '1',
      //   role: user.Attributes?.find(attr => attr.Name === 'custom:role')?.Value || ''
      // }));

      // console.log(userList);

      const dbUsers = await this.usersRepository.find();

      if (!dbUsers) {
        throw new NotFoundException('No users record found!');
      }

      // return userList;
      return dbUsers;

    } catch (error) {
      console.error('Error retrieving users from Cognito:', error);

      if (error.name === 'NotFoundException') {
        throw new NotFoundException('No users record found');
      }

      throw new InternalServerErrorException('Failed to retrieve users from Cognito');
    }
  }





  // Function to fetch Cognito users by role
  // async getCognitoUserByRole(role: string): Promise<any[]> {
  //   try {
  //     const params = {
  //       UserPoolId: process.env.COGNITO_USER_POOL_ID,
  //     };

  //     const data = new ListUsersCommand(params);
  //     const response = await cognito.send(data);

  //     const filteredUsers = response.Users?.filter(user =>
  //       user.Attributes?.some(attr => attr.Name === 'custom:role' && attr.Value === role)
  //     );

  //     return filteredUsers || [];
  //   } catch (error) {
  //     console.error(`Error fetching users by role (${role}) from Cognito:`, error);
  //     throw new NotFoundException('Failed to fetch users by role from Cognito');
  //   }
  // }







  // Function for getting a user by username and their associated products
  async findUserById(userId: string): Promise<{userData: any}> {

    const s3Client = new S3Client({
      region: process.env.AWS_REGION,
    });

    try {
      // const params = {
      //   UserPoolId: process.env.COGNITO_USER_POOL_ID,
      //   Username: username,
      // };

      // const userCommand = new AdminGetUserCommand(params);
      // const response = await cognito.send(userCommand);

  //     // if (!response) {
  //     //   throw new NotFoundException(`User with given id not found!`);
  //     // }

  //     // const userId = response.UserAttributes.find(attr => attr.Name === 'sub')?.Value;

  //     // if (!userId) {
  //     //   throw new NotFoundException(`User with given id not found!`);
  //     // }

      const user = await this.usersRepository.findOne({
        where: { id: userId },
        relations: ['cart', 'cart.product'],
      });

      if (!user) {
        throw new NotFoundException(`User with given id ${userId} not found!`);
      }

      let imageUrls : string[] = [];

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
        userData: user
       };
    } catch (error) {
      console.error('Error retrieving user from Cognito:', error);

      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to retrieve user!');
    }
  }







  // Function for updating a user by id
  async update(userId: string, _updateUserDto: UpdateUserDto): Promise<{ message: string, updatedUser: any }> {

    try {

      const user = await this.usersRepository.findOne({ where: { id: userId } });

      if (!user) {
        throw new NotFoundException(`User with id ${userId} not found`);
      }

      const result = await this.usersRepository.update(userId, _updateUserDto)

      if (result.affected === 0) {
        throw new NotFoundException(`Product with id ${userId} not found`);
      }

      const updatedUser = await this.usersRepository.findOne({ where: { id: userId } });
      console.log(`User with given id ${userId} updated successfully`);

      // const userAttributes = [];

      // if (_updateUserDto.name) {
      //   userAttributes.push({
      //     Name: 'name',
      //     Value: String(_updateUserDto.name),
      //   });
      // }


      // if (_updateUserDto.email) {
      //   userAttributes.push(
      //     { Name: 'email', Value: String(_updateUserDto.email) },
      //     // { Name: 'email_verified', Value: 'false' }
      //   );
      // }


      // if (_updateUserDto.address) {
      //   userAttributes.push({
      //     Name: 'custom:address',
      //     Value: String(_updateUserDto.address),
      //   });
      // }


      // if (_updateUserDto.isActive !== undefined) {
      //   userAttributes.push({
      //     Name: 'custom:isActive',
      //     Value: String(_updateUserDto.isActive ? '1' : '0'),
      //   });
      // }


      // if (_updateUserDto.password) {
      //   await this.resetPassword(userId, _updateUserDto.password);
      // }


      // if (userAttributes.length === 0) {
      //   throw new NotFoundException('No attributes to update.');
      // }


      // const params = {
      //   UserPoolId: process.env.COGNITO_USER_POOL_ID,
      //   Username: userId,
      //   UserAttributes: userAttributes,
      // };

      // const command = new AdminUpdateUserAttributesCommand(params);
      // await cognito.send(command);
      // console.log(`User with username ${userId} updated successfully.`);


      // if (_updateUserDto.email) {
      //   console.log(`A verification email has been sent to ${_updateUserDto.email}.`);
      // }

      return {
        message: 'User updated successfully',
        updatedUser
      };

    } catch (error) {
      console.error('Error updating user:', error.message || error);

      if (error instanceof NotFoundException) {
        throw error;
      }


      throw new InternalServerErrorException('Failed to update user attributes.');
    }

  }







  // Function for deleting a user by id
  async remove(id: string): Promise<{ message: string, deletedUser: any }> {

    try {

      const user = await this.usersRepository.findOne({ where: { id } });

      if (!user) {
        throw new NotFoundException(`User with given userid ${id} not found!`);
      }

      const deletedUser = await this.usersRepository.remove(user);
      console.log(`User with given id ${id} deleted successfully!`);

      return {
        message: 'User deleted successfully, The deleted user details are: ',
        deletedUser
      };

    } catch (error) {

      console.error('Error deleting user', error);

      if (error instanceof NotFoundException) {
        throw error;
      }

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
  // private async resetPassword(username: string, newPassword: string): Promise<void> {

  //   try {

  //     const params = {
  //       UserPoolId: process.env.COGNITO_USER_POOL_ID,
  //       Username: username,
  //       Password: newPassword,
  //       Permanent: true,
  //     };

  //     const command = new AdminSetUserPasswordCommand(params);
  //     await cognito.send(command);

  //     console.log(`Password for user with username ${username} updated successfully`);
  //   } catch (error) {
  //     console.error('Error resetting password', error.message || error);
  //     throw new ConflictException('Failed to update password');
  //   }

  // }


}


