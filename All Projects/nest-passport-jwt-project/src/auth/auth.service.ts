import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginInterface } from './dto/login.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {

  constructor(
    private jwtService: JwtService,
    private readonly userService: UsersService,
  ) {}

  async login(authPayload: LoginInterface): Promise<any> {
    const user = await this.userService.validateUser(authPayload);
    const { password, ...result } = user;
    
    return this.jwtService.sign(result);
  }

}
