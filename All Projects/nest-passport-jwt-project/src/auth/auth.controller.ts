// import { Body, Controller, Get, Post, Req, Request, UseGuards } from '@nestjs/common';
// // import { JwtAuthGuard } from './gurards/jwt.guard';
// // import { Request } from 'express';
// import { AuthService } from './auth.service';
// import { LoginDto } from './dto/login.dto';
// import { Roles } from './gurards/roles.decorator';
// import { ERoles } from 'src/users/dto/create-user.dto';

import { Body, InternalServerErrorException, Post } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { UsersService } from "src/users/users.service";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";

// interface RequestWithUser extends Request {
//   user?: any;
// }

// @Controller('auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService,
    ) { }

    //   @Post('login')
    //   async logIn(@Body() logInDto: LoginDto) {
    //     try{
    //       const accessToken = await this.authService.login(logInDto);
    //       return { accessToken };

    //     }
    //     catch(e){

    //     }
    //   }

    //   @UseGuards(JwtAuthGuard)
    //   @Get('status')
    //   status(@Request() req: RequestWithUser) {
    //     console.log('Inside authController status method');
    //     console.log(req.user);

    //     return { message: 'User is authenticated', user: req.user };
    //   }






    @Post('registerUser')
    @ApiOperation({ summary: 'Register a new user' })
    @ApiBody({ type: CreateUserDto })
    @ApiResponse({ status: 200, description: 'User registered successfully' })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async register(@Body() createUserDto: CreateUserDto) {

        try {
            const result = await this.authService.registerUser(createUserDto);
            console.log('User registration data is: ', result);

            return result;
        } catch (error) {
            console.error('Error during registration:', error.message);
            throw new InternalServerErrorException('User registration failed');
        }

    }





    //  Login route
  @Post('login')
  @ApiOperation({ summary: 'Authenticate a user and return a JWT token' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'User authenticated successfully' })
  @ApiResponse({ status: 500, description: 'Internal server error' })

  async login(@Body() loginDto: LoginDto) {


    try {
      const token = await this.authService.login(loginDto);
      return { token };
    } catch (error) {
      console.error('Error during login:', error.message);
      throw new InternalServerErrorException('Login failed');
    }

  }



}
