import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

import { UploadService } from 'services/upload.service';
import { Product } from 'src/products/entities/product.entity';

// import { JwtAuthGuard } from 'src/auth/gurards/jwt.guard';
// import { AuthModule } from 'src/auth/auth.module';

@Module({

  imports: [TypeOrmModule.forFeature([User, Product])],
  controllers: [UsersController],
  providers: [ UsersService, UploadService],
  exports: [UsersService, UploadService],

})

export class UsersModule {}
