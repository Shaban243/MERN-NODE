import { Module } from '@nestjs/common';
// import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
// import { JwtStrategy } from './strategies/jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { UsersModule } from 'src/users/users.module';
// import { JwtAuthGuard } from './gurards/jwt.guard';
import { UsersService } from 'src/users/users.service';
import { ProductsService } from 'src/products/products.service';
import { UsersController } from 'src/users/users.controller';
import { ProductsModule } from 'src/products/products.module';
import { Product } from 'src/products/entities/product.entity';
import { AdminService } from 'src/admin/admin.service';
import { AdminModule } from 'src/admin/admin.module';
import { Admin } from 'typeorm';


@Module({

  imports: [
    AdminModule,
    PassportModule,
    UsersModule,
    ProductsModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: '1h' },
    }),
    TypeOrmModule.forFeature([User, Product, AuthService]),
  ],
  controllers: [UsersController],
  providers: [AuthService, UsersService, ProductsService, AdminService],
  exports: [UsersService, AuthService],
})


export class AuthModule { }
