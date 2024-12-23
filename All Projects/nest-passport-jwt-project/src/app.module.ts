import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { Product } from './products/entities/product.entity';
import { User } from './users/entities/user.entity';
import { AdminModule } from './admin/admin.module';
import { Admin } from './admin/entities/admin.entity';
import { AppController } from './app.controller';
import { Cart } from './cart/entities/cart.entity';
import { CartModule } from './cart/cart.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // envFilePath: '.local.env', 
      // envFilePath: '.prod.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: "aws-0-ap-southeast-1.pooler.supabase.com",
        port: +configService.get<number>('DB_PORT'),
        username: "postgres.iwzablpjorjvsetzogtn",
        password: "4SrRUHtLARTOGSOh",
        database: "postgres",
        synchronize: true,
        entities: [User, Product, Admin, Cart],
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    ProductsModule,
    CartModule,
    AdminModule
  ],
 
  controllers: [AppController],
  providers: [],
})

export class AppModule {}






