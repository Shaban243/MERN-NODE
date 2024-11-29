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




@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly uploadService: UploadService,
  ) {}



  @Post('registerUser')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 200, description: 'User registered successfully' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async register(@Body() createUserDto: CreateUserDto)   {

    try {
      const result = await this.usersService.registerUser(createUserDto);
      console.log('User registration data is: ', result);

      return result;
    } catch (error) {
      console.error('Error during registration:', error.message);
      throw new InternalServerErrorException('User registration failed');
    } 

  }







  // Login route
  @Post('login')
  @ApiOperation({ summary: 'Authenticate a user and return a JWT token' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'User authenticated successfully' })
  @ApiResponse({ status: 500, description: 'Internal server error' })

  async login(@Body() loginDto: LoginDto) {


    try {
      const token = await this.usersService.login(loginDto);
      return { token };
    } catch (error) {
      console.error('Error during login:', error.message);
      throw new InternalServerErrorException('Login failed');
    }

  }

  




  // Route for creating a new user (admin-only access)
  @Post('createUser')
  @ApiBearerAuth()
  @UseGuards(CognitoAuthGuard, RolesGuard)
  @Roles([Role.SuperAdmin, Role.UserAssistantAdmin])
  // @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Create a new user (Super-Admin access && Users-Assistant Admin access)' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 500, description: 'Failed to create user' })

  async createUser(@Body() createUserDto: CreateUserDto)   {

    try {
      const createdUser = await this.usersService.createUser(createUserDto);
      return createdUser;
    } catch (error) {
      console.error('Error creating user:', error.message);
      throw new InternalServerErrorException('Failed to create user');
    }

  }








  // Route for getting a list of users (admin-only access)
  @Get('getAllUsers')
  @ApiBearerAuth()
  @UseGuards(CognitoAuthGuard, RolesGuard)
  @Roles([Role.SuperAdmin, Role.UserAssistantAdmin])
  // @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Retrieve all users (Super-Admin access && Users-Assistant Admin access)' })
  @ApiResponse({ status: 201, description: 'User list retrieved successfully' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden: Only admin can retrieve users',
  })
  @ApiResponse({ status: 500, description: 'Failed to create user' })

  async findAll(@Req() req)   {

    try {
      console.log({ user: req.user });
      return this.usersService.findAll();
    } catch (error) {
      console.error('Error retrieving users:', error.message);
      throw error;
    }

  }







  // Route for uploading user image
  @Post(':id/uploadimage')
  @UseGuards(CognitoAuthGuard, RolesGuard)
  @Roles([Role.SuperAdmin, Role.UserAssistantAdmin])
  @UseInterceptors(FileInterceptor('file'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload an image for a specific user (Super-Admin access && Users-Assistant Admin access)' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({
    name: 'id',
    description: 'User ID to upload the image for',
    type: String,
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Image uploaded successfully' })
  @ApiResponse({ status: 500, description: 'Failed to upload image' })

  async uploadUserImage(
    @Param('id') userId: string,
    @UploadedFile() file: Express.Multer.File,
  )   {

    try {

      const imageUrl = await this.uploadService.uploadFile(
        file,
        `user/${userId}`,
      );
      await this.usersService.updateUserImage(userId, imageUrl);
      return { imageUrl };
    } catch (error) {
      console.error(
        `Error uploading image for User ID ${userId}:`,
        error.message,
      );
      throw new InternalServerErrorException('Failed to upload user image');
    }

  }







  // Route for getting user by id (admin-only access)
  @Get('getUser/:id')
  @ApiBearerAuth()
  @UseGuards(CognitoAuthGuard, RolesGuard)
  @Roles([Role.SuperAdmin, Role.UserAssistantAdmin])
  @ApiOperation({ summary: 'Get details of a specific user by ID (Super-Admin access && Users-Assistant Admin access)' })
  @ApiParam({ name: 'id', description: 'User ID to retrieve details', type: String })
  @ApiResponse({ status: 200, description: 'User details retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(@Param('id') id: string): Promise<User>   {

    try {
      const user = await this.usersService.findUserById(id);
      return user;
    } catch (error) {
      console.error(`Error finding the user with id ${id}`, error.message);
      throw error;
    }
    
  }








  // Route for updating user by id
  @Put('updateUser/:id')
  @ApiBearerAuth()
  @UseGuards(CognitoAuthGuard, RolesGuard)
  @Roles([Role.SuperAdmin, Role.UserAssistantAdmin])
  @ApiOperation({ summary: 'Update a specific user by ID (Super-Admin access && Users-Assistant Admin access)' })
  @ApiParam({ name: 'id', description: 'User ID to update', type: String })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto)   {

    try {
      const updatedUser = await this.usersService.update(id, updateUserDto);
      return updatedUser;
    } catch (error) {
      console.error(`Error updating user with id ${id}`, error.message);
      throw error;
    }

  }







  // Route for deleting a user by id (admin-only access)
  @Delete('deleteUser/:id')
  @ApiBearerAuth()
  @UseGuards(CognitoAuthGuard, RolesGuard)
  @Roles([Role.SuperAdmin, Role.UserAssistantAdmin])
  @ApiOperation({ summary: 'Delete a specific user by ID (Super-Admin access && Users-Assistant Admin access)' })
  @ApiParam({ name: 'id', description: 'User ID to delete', type: String })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })

  async remove(@Param('id') id: string)    {

    try {
      const deletedUser = await this.usersService.remove(id);
      console.log('deletedUser is: ', deletedUser);
      return deletedUser;
    } catch (error) {
      console.error(`Error deleting the user with id ${id}`, error.message);
      throw error;
    }

  }








  // Route for setting the confirmation status to confirmed
  @Post('confirm/:username')
  @ApiOperation({ summary: 'Confirm the confirmation status of user (Super-Admin access && Users-Assistant Admin access)' })
  @ApiParam({
    name: 'username',
    description: 'Confirm User Status',
    type: String,
  })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'User Confirmation status successfully confirmed' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async confirmUser(
    @Param('username') username: string,
    @Body() confirmUserInput: ConfirmUserDto,
  )    {

    try {
      const userPoolId = process.env.COGNITO_USER_POOL_ID;
      const { newPassword } = confirmUserInput;
      await this.usersService.confirmUserSignup(
        username,
        newPassword,
        userPoolId,
      );

      
      return { message: 'User confirmation successful.' };
    } catch (error) {
      console.error('Error confirming the status for user', error.message);
      throw error;
    }

  }


}
