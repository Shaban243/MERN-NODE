import { forwardRef, Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { UploadService } from 'services/upload.service';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';
import { User } from 'src/users/entities/user.entity';



@Module({

  imports: [TypeOrmModule.forFeature([Product, User])],
  controllers: [ProductsController],
  providers: [ProductsService, UploadService],
  exports: [ProductsService, UploadService],

})


export class ProductsModule {}
