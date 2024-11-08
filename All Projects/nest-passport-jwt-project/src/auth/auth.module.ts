import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity'; // Import the User entity

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      global: true,
      secret: '9pX%k/a}]',
      signOptions: { expiresIn: '1h' }
    }),
    TypeOrmModule.forFeature([User]), // Register the User entity with TypeORM
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
