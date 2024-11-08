import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthPayloadDto } from './dto/auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity'; 

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        @InjectRepository(User) private userRepository: Repository<User>
        
         
    ) {}

    async validateUser(authPayload: AuthPayloadDto): Promise<any> {
        const {name, password } = authPayload;

        
        const user = await this.userRepository.findOne({ where: { email: name } });

        
        if (user && user.password === password) {
            const { password, ...result } = user; 
            return this.jwtService.sign(result); 

        }

        return null; 
    }
}
