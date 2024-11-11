import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './gurards/jwt.guard';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

interface RequestWithUser extends Request {
  user?: any;
}

@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async logIn(@Body() logInDto: LoginDto) {
    const accessToken = await this.authService.login(logInDto);
    return { accessToken };
  }

  // @UseGuards(JwtAuthGuard)
  @Get('status')
  status(@Req() req: RequestWithUser) {
    console.log('Inside authController status method');
    console.log(req.user);

    return { message: 'User is authenticated', user: req.user };
  }

}
