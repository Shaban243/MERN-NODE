import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

import { UploadService } from 'services/upload.service';
import { Product } from 'src/products/entities/product.entity';
import { ProductsService } from 'src/products/products.service';

// import { JwtAuthGuard } from 'src/auth/gurards/jwt.guard';
// import { AuthModule } from 'src/auth/auth.module';

@Module({

  imports: [TypeOrmModule.forFeature([Product, User])], 
  controllers: [UsersController],
  providers: [ UploadService, UsersService],
  exports: [UsersService],

})

export class UsersModule {}
