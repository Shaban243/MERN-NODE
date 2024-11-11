import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity'; 
import { UsersModule } from 'src/users/users.module';
import { JwtAuthGuard } from './gurards/jwt.guard';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      global: true,
      secret: '9pX%k/a}]',
      signOptions: { expiresIn: '1h' },
    }),

    TypeOrmModule.forFeature([User]), 
    UsersModule,
  ],

  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})

export class AuthModule {}
