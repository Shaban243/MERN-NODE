import { forwardRef, Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { UploadService } from 'services/upload.service';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';
import { User } from 'src/users/entities/user.entity';
import { Cart } from 'src/cart/entities/cart.entity';
import { CartService } from 'src/cart/cart.service';



@Module({

  imports: [TypeOrmModule.forFeature([Product, User, Cart])],
  controllers: [ProductsController],
  providers: [ProductsService, UploadService],
  exports: [ProductsService],

})


export class ProductsModule {}
