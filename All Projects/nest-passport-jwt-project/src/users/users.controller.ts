import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UsePipes,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
  InternalServerErrorException,
  NotFoundException,
  ForbiddenException,
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

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RolesGuard } from 'src/auth/gurards/roles.guard';
import { User } from './entities/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { LoginDto } from 'src/auth/dto/login.dto';
import { Role } from 'src/auth/roles.enum';
import { CognitoAuthGuard } from 'src/auth/gurards/cognito.guard';
import { Roles } from 'src/auth/gurards/roles.decorator';
import { ConfirmEmailDto } from './dto/confirm-email.dto';
import { NotAuthorizedException } from '@aws-sdk/client-cognito-identity-provider';




@ApiTags('Users')
@Controller('users')
export class UsersController {
  
  constructor(
    private readonly usersService: UsersService,
  ) { }



  @Post('registerUser')
  @UseInterceptors(FileInterceptor('imageFile'))
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
        imageFile: {
          type: "string",
          format: "binary"
        },
      },
      required: ['name', 'email', 'password', 'address']
    },
  })
  @ApiResponse({ status: 200, description: 'User registered successfully' })
  @ApiResponse({
    status: 409,
    description: 'Conflict',
    schema: {
      example: {
        statusCode: 409,
        message: 'A user with this email already exists',
        error: 'Conflict',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'BadRequest',
    schema: {
      example: {
        statusCode: 400,
        message: 'Invalid file type. Only image files (jpg, jpeg, png, gif) are allowed.',
        error: 'BadRequest',
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

      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException('User registration failed');
    }

  }






  // Route for confirming the user email
  @Post('confirm-email')
  @ApiOperation({ summary: 'Cofirming the email through email verification code' })
  @ApiResponse({ status: 200, description: 'email verified successfully' })
  @ApiResponse({
    status: 400,
    description: 'BadRequest',
    schema: {
      example: {
        statusCode: 400,
        message: 'ExpiredCodeException',
        error: 'BadRequest',
      },
    },
  })

  @ApiResponse({
    status: 400,
    description: 'BadRequest',
    schema: {
      example: {
        statusCode: 400,
        message: 'CodeMismatchException',
        error: 'BadRequest',
      },
    },
  })

  @ApiResponse({ status: 500, description: 'Failed to confirm email status' })

  async confirmEmail(@Body() confirmEmailDto: ConfirmEmailDto) {

    try {

      const emailStatus = this.usersService.confirmEmail(
        confirmEmailDto.email,
        confirmEmailDto.confirmationCode
      );

      return emailStatus;

    } catch (error) {
      console.error('Error confirming the user email', error.message);

      if(error instanceof BadRequestException) {
        throw error;
      }

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
    description: 'Forbidden',
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
    description: 'Unauthorized',
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
    description: 'BadRequest',
    schema: {
      example: {
        statusCode: 400,
        message: 'Email and password are required',
        error: 'BadRequest',
      },
    },
  })


  @ApiResponse({
    status: 404,
    description: 'NotFound',
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
      return await this.usersService.login(loginDto);

    } catch (error) {
      
      console.error('Error during login:', error, error instanceof NotAuthorizedException);

      if (error instanceof ForbiddenException) {
        throw error;
      }

      if (error instanceof NotAuthorizedException) {
        throw new UnauthorizedException(error.message);
      }

      if (error instanceof BadRequestException) {
        throw error;
      }


      throw new InternalServerErrorException('Login failed');
    }

  }










  @Get('getProfile')
  @ApiBearerAuth()
  @UseGuards(CognitoAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Fetch the logged-in user’s profile (Logged-in users only)' })
  // @ApiParam({ 'email: string'})
  @ApiResponse({ status: 200, description: 'User profile fetched successfully' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    schema: {
      example: {
        statusCode: 401,
        message: 'Please log in to access your profile',
        error: 'Unauthorized',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'NotFound',
    schema: {
      example: {
        statusCode: 404,
        message: 'User not found!',
        error: 'NotFound',
      },
    },
  })
  @ApiResponse({ status: 500, description: 'Failed to retrieve user profile' })
  async getProfile(@Req() req: Request) {

    try {

      const authorizationHeader = req.headers['authorization'];

      if (!authorizationHeader) {
        throw new UnauthorizedException('Authorization header is missing!');
      }

      const accessToken = authorizationHeader.split(' ')[1];

      if (!accessToken) {
        throw new UnauthorizedException('Access token is missing!');
      }

      const claims = await this.usersService.getClaims(accessToken);

      const profile = await this.usersService.getUserProfile(claims.email);

      return profile;

    } catch (error) {
      console.error('Error fetching profile:', error.message);

      if (error instanceof UnauthorizedException) {
        throw error;
      }

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to retrieve user profile');
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
    description: 'Forbidden',
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
    description: 'NotFound',
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
  @ApiResponse({
    status: 400,
    description: 'BadRequest',
    schema: {
      example: {
        statusCode: 400,
        message: 'Invalid User Id format, Please enter correct Id for retrieving the user record!',
        error: ':BadRequest'
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'NotFound',
    schema: {
      example: {
        statusCode: 404,
        message: 'User with given id not found!',
        error: 'NotFound'
      }
    }
  })
  @ApiResponse({ status: 500, description: 'Failed to retrieve user by id' })
  async findOne(@Param('userId') userId: string) {

    try {

      return await this.usersService.findUserById(userId);

    } catch (error) {
      
      console.error(`Error finding the user with id ${userId}`, error.message);

      if (error instanceof NotFoundException) {
        throw error;
      }

      if(error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to retrieve the user by given id!')
    }

  }








  // Route for updating user by id
  @Put('updateUser/:userId')
  @ApiOperation({ summary: 'Update a specific user by userId (Super-Admin access && Users-Assistant Admin access && User-access)' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({
    status: 400,
    description: 'BadRequest',
    schema: {
      example: {
        statusCode: 400,
        message: 'Invalid user Id format, Please enter correct Id for updating the user record!',
        error: ':BadRequest'
      }
    }
  })
  @ApiResponse({ 
    status: 404,
    description: 'NotFound',
    schema: {
      example: {
        statusCode: 404,
        message: 'User with given id not found!',
        error: 'NotFound'
      }
    }
   })
   @ApiResponse({ status: 500, description: 'Failed to update user record!'})

  async update(@Param('userId') userId: string, @Body() updateUserDto: UpdateUserDto) {

    try {

      const updatedUser = await this.usersService.update(userId, updateUserDto);

      return updatedUser;

    } catch (error) {
      
      console.error(`Error updating user with username ${userId}`, error.message);

      if(error instanceof NotFoundException) {
        throw error;
      } 

      if(error instanceof BadRequestException) {
        throw error;
      }

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
  @ApiResponse({
    status: 400,
    description: 'BadRequest',
    schema: {
      example: {
        statusCode: 400,
        message: 'Invalid user Id format, Please enter correct Id for deleting the user record!',
        error: ':BadRequest'
      }
    }
  })
  @ApiResponse({ 
    status: 404, 
    description: 'User not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'User with given id not found',
        error: 'NotFound'
      }
    }
  })
  
  @ApiResponse({ status: 500, description: 'Failed to delete user record!'})

  async remove(@Param('userId') userId: string) {

    try {

      return await this.usersService.remove(userId);

    } catch (error) {
      console.error(`Error deleting the user with id ${userId}`, error.message);

      if(error instanceof NotFoundException) {
        throw error;
      }

      if(error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException(`Failed to delete the user with given id!`);
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
