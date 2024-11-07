import { Body, Controller, HttpException, Post, UseGuards } from '@nestjs/common';
import { AuthPayloadDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { LocalGuard } from './gurards/local.guard';

@Controller('auth')
export class AuthController {

constructor(private authService: AuthService) {}

@Post('login')
@UseGuards(LocalGuard)
signIn( @Body()authPayload: AuthPayloadDto) {
    const user =  this.authService.validateUser(authPayload);
    
    return user;
}


}
