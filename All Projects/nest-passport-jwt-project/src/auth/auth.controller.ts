import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
// import { AuthPayloadDto } from './dto/auth.dto';
// import { AuthService } from './auth.service';
// import { AuthGuard } from '@nestjs/passport';
import { LocalGuard } from './gurards/local.guard';
import { JwtAuthGuard } from './gurards/jwt.guard';
import { Request } from 'express';



interface RequestWithUser extends Request {
    user?: any;
  }


@Controller('auth')
export class AuthController {

constructor() {}

@Post('login')
@UseGuards(LocalGuard)
signIn( @Req() req: Request) {
    
    return req.user;
}


@Get('status')
@UseGuards(JwtAuthGuard)
status(@Req() req: RequestWithUser) {
    
    console.log('Inside authController status method');
    console.log(req.user);

    return { message: 'User is authenticated', user: req.user };

}


}
