import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
  InternalServerErrorException,
  Query,
  NotFoundException,
  ForbiddenException,
  HttpException,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { Multer } from 'multer';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RolesGuard } from 'src/auth/gurards/roles.guard';
import { User } from './entities/user.entity';
import { UploadService } from 'services/upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { LoginDto } from 'src/auth/dto/login.dto';
import { Role } from 'src/auth/roles.enum';
import { CognitoAuthGuard } from 'src/auth/gurards/cognito.guard';
import { Roles } from 'src/auth/gurards/roles.decorator';
import { ConfirmUserDto } from './dto/confirm-user.dto';
import { ConfirmEmailDto } from './dto/confirm-email.dto';
import { NotAuthorizedException } from '@aws-sdk/client-cognito-identity-provider';




@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    // private readonly uploadService: UploadService,
  ) { }



  @Post('registerUser')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Register a new user' })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        name: { type: "string" },
        email: { type: "string" },
        password: { type: "string" },
        address: { type: "string" },
        isActive: { type: "boolean" },
        role: { type: "string" },
        file: {
          type: "string",
          format: "binary"
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'User registered successfully' })
  @ApiResponse({
    status: 409,
    description: 'Conflict: User with this email already exists',
    schema: {
      example: {
        statusCode: 409,
        message: 'A user with this email already exists',
        error: 'Conflict',
      },
    },
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async register(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile() file: Express.Multer.File
  ) {

    try {
      const result = await this.usersService.registerUser(createUserDto, file);
      console.log('User registration data is: ', result);

      return result;
    } catch (error) {
      console.error('Error during registration:', error.message);

      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('User registration failed');
    }

  }






  // Route for confirming the user email
  @Post('confirm-email')
  @ApiOperation({ summary: 'Cofirming the email through email verification code' })
  @ApiResponse({ status: 200, description: 'email verified successfully' })
  @ApiResponse({ status: 500, description: 'Internal server error' })

  async confirmEmail(@Body() confirmEmailDto: ConfirmEmailDto) {

    try {
      const emailStatus = this.usersService.confirmEmail(
        confirmEmailDto.email,
        confirmEmailDto.confirmationCode
      );
      return emailStatus;

    } catch (error) {
      console.error('Error confirming the user email', error.message);
      throw new InternalServerErrorException('Error confirming the email');
    }

  }








  // Login route
  @Post('login')
  @ApiOperation({ summary: 'Authenticate a user and return a JWT token' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'User authenticated successfully' })
  @ApiResponse({
    status: 403,
    description: 'Email not verified',
    schema: {
      example: {
        statusCode: 403,
        message: 'Please verify your email before logging in.',
        error: 'Forbidden',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
    schema: {
      example: {
        statusCode: 401,
        message: 'Invalid email or password',
        error: 'Unauthorized',
      },
    },
  })

  @ApiResponse({
    status: 400,
    description: 'Invalid credentials',
    schema: {
      example: {
        statusCode: 401,
        message: 'Email and password are required',
        error: 'BadRequest',
      },
    },
  })


  @ApiResponse({
    status: 404,
    description: 'Invalid credentials',
    schema: {
      example: {
        statusCode: 404,
        message: 'Email and password are required',
        error: 'NotFound',
      },
    },
  })


  @ApiResponse({ status: 500, description: 'Internal server error' })

  async login(@Body() loginDto: LoginDto) {


    try {
      const token = await this.usersService.login(loginDto);
      return { token };
    } catch (error) {
      console.error('Error during login:', error, error instanceof NotAuthorizedException);

      if (error instanceof ForbiddenException) {
        throw error;
      }
  
      if (error instanceof NotAuthorizedException) {
        throw new UnauthorizedException(error.message);
      }

      if(error instanceof BadRequestException) {
        throw error;
      }

      if(error instanceof NotFoundException) {
        throw error;
      }
      
      throw new InternalServerErrorException('Login failed');
    }

  }








  // Route for getting a list of users (admin-only access)
  @Get('getAllUsers')
  @ApiBearerAuth()
  @UseGuards(CognitoAuthGuard, RolesGuard)
  @Roles([Role.SuperAdmin, Role.UserAssistantAdmin])
  @ApiOperation({ summary: 'Retrieve all users (Super-Admin && User-Assistant Admin access)' })
  @ApiResponse({ status: 200, description: 'User list retrieved successfully' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden: Only SuperAdmin or UserAssistantAdmin can retrieve users record',
    schema: {
      example: {
        statusCode: 403,
        message: ' Only SuperAdmin or UserAssistantAdmin can retrieve users record',
        error: 'Forbidden',
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'No users record found!',
    schema: {
      example: {
        statusCode: 404,
        message: 'No users record found',
        error: 'NotFound'
      },
    },
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async findAll(@Req() req) {

    try {

      return this.usersService.findAll();
    } catch (error) {
      console.error('Error retrieving users:', error.message);

      if (error instanceof ForbiddenException) {
        throw error;
      }

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to retrieve users record');
    }
  }






  // Route for uploading user image
  // @Post(':id/uploadimage')
  // @UseInterceptors(FileInterceptor('file'))
  // // @ApiBearerAuth()
  // @ApiOperation({ summary: 'Upload an image for a specific user' })
  // @ApiConsumes('multipart/form-data')
  // @ApiParam({
  //   name: 'id',
  //   description: 'User ID to upload the image for',
  //   type: String,
  // })
  // @ApiBody({
  //   schema: {
  //     type: 'object',
  //     properties: {
  //       file: {
  //         type: 'string',
  //         format: 'binary',
  //       },
  //     },
  //   },
  // })
  // @ApiResponse({ status: 201, description: 'Image uploaded successfully' })
  // @ApiResponse({ status: 500, description: 'Failed to upload image' })

  // async uploadUserImage(
  //   @Param('id') userId: string,
  //   @UploadedFile() file: Express.Multer.File,
  // ) {

  //   try {

  //     const imageUrl = await this.uploadService.uploadFile(
  //       file,
  //       `user/${userId}`,
  //     );
  //     await this.usersService.updateUserImage(userId, imageUrl);
  //     return { imageUrl };
  //   } catch (error) {
  //     console.error(
  //       `Error uploading image for User ID ${userId}:`,
  //       error.message,
  //     );
  //     throw new InternalServerErrorException('Failed to upload user image');
  //   }

  // }







  // Route for getting user by id (admin-only access)
  @Get('getUser/:userId')
  @ApiBearerAuth()
  @UseGuards(CognitoAuthGuard, RolesGuard)
  @Roles([Role.SuperAdmin, Role.UserAssistantAdmin])
  @ApiOperation({ summary: 'Get details of a specific user by userId (Super-Admin access && Users-Assistant Admin access)' })
  @ApiResponse({ status: 200, description: 'User details retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(@Param('userId') userId: string): Promise<User> {

    try {
      const user = await this.usersService.findUserById(userId);
      return user;
    } catch (error) {
      console.error(`Error finding the user with id ${userId}`, error.message);
      throw new NotFoundException('No user record found!');
    }

  }








  // Route for updating user by id
  @Put('updateUser/:userId')
  // @ApiBearerAuth()
  // @UseGuards(CognitoAuthGuard, RolesGuard)
  // @Roles([Role.SuperAdmin, Role.UserAssistantAdmin, Role.User])
  @ApiOperation({ summary: 'Update a specific user by userId (Super-Admin access && Users-Assistant Admin access && User-access)' })
  @ApiParam({ name: 'userId', description: 'userId to update', type: String })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })

  async update(@Param('userId') userId: string, @Body() updateUserDto: UpdateUserDto) {

    try {
      const updatedUser = await this.usersService.update(userId, updateUserDto);
      return updatedUser;
    } catch (error) {
      console.error(`Error updating user with username ${userId}`, error.message);
      throw new InternalServerErrorException('Failed to update user attributes.');
    }

  }







  // Route for deleting a user by id (admin-only access)
  @Delete('deleteUser/:userId')
  @ApiBearerAuth()
  @UseGuards(CognitoAuthGuard, RolesGuard)
  @Roles([Role.SuperAdmin, Role.UserAssistantAdmin])
  @ApiOperation({ summary: 'Delete a specific user by userId (Super-Admin access && Users-Assistant Admin access)' })
  @ApiParam({ name: 'userId', description: 'UserId to delete', type: String })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })

  async remove(@Param('userId') userId: string) {

    try {
      const deletedUser = await this.usersService.remove(userId);
      console.log('deletedUser is: ', deletedUser);
      return deletedUser;
    } catch (error) {
      console.error(`Error deleting the user with id ${userId}`, error.message);
      throw new NotFoundException(`User with given id not found!`);
    }

  }








  // // Route for setting the confirmation status to confirmed
  // @Post('confirm/:username')
  // @ApiOperation({ summary: 'Confirm the confirmation status of user (Super-Admin access && Users-Assistant Admin access)' })
  // @ApiParam({
  //   name: 'username',
  //   description: 'Confirm User Status',
  //   type: String,
  // })
  // @ApiBearerAuth()
  // @ApiResponse({ status: 200, description: 'User Confirmation status successfully confirmed' })
  // @ApiResponse({ status: 404, description: 'User not found' })
  // async confirmUser(
  //   @Param('username') username: string,
  //   @Body() confirmUserInput: ConfirmUserDto,
  // )    {

  //   try {
  //     const userPoolId = process.env.COGNITO_USER_POOL_ID;
  //     const { newPassword } = confirmUserInput;
  //     await this.usersService.confirmUserSignup(
  //       username,
  //       newPassword,
  //       userPoolId,
  //     );


  //     return { message: 'User confirmation successful.' };
  //   } catch (error) {
  //     console.error('Error confirming the status for user', error.message);
  //     throw error;
  //   }

  // }


}
