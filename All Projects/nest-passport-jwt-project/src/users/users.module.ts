import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UploadService } from 'services/upload.service';
import { Product } from 'src/products/entities/product.entity';
import { Cart } from 'src/cart/entities/cart.entity';
import { Admin } from 'src/admin/entities/admin.entity';
import { JwtService } from '@nestjs/jwt';
import { AdminModule } from 'src/admin/admin.module';
import { AdminService } from 'src/admin/admin.service';
import { AdminRepository } from 'src/admin/admin.repository';


// import { JwtAuthGuard } from 'src/auth/gurards/jwt.guard';
// import { AuthModule } from 'src/auth/auth.module';

@Module({

  imports: [TypeOrmModule.forFeature([Product, User, Cart,Admin]), forwardRef(() => AdminModule)],
  controllers: [UsersController],
  providers: [UploadService, UsersService, JwtService],
  exports: [UsersService],

})

export class UsersModule { }
