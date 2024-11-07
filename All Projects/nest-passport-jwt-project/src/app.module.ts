import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { Product } from './products/entities/product.entity';
import { User } from './users/entities/user.entity';

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
        entities: [User, Product], 
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    ProductsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}





// @Module({
//   imports: [
//     TypeOrmModule.forRootAsync({
//       imports: [ConfigModule.forRoot({
//         isGlobal: true,
//         // envFilePath: ".local.env",
//         // envFilePath: ".prod.env",
//       })],
//       useFactory: (configService: ConfigService) => ({
//         type: 'postgres',
//         host: 'aws-0-ap-southeast-1.pooler.supabase.com',  //configService.get('DB_HOST')  ||,
//         port:  6543, // +configService.get<number>('DB_PORT') ||,
//         username:  'postgres.iwzablpjorjvsetzogtn', //configService.get('DB_USERNAME') || //postgres.iwzablpjorjvsetzogtn
//         password:  'postgres', //configService.get('DB_PASSWORD') ||,
//         database:  'postgres',//configService.get('DB_DATABASE') ||
//         synchronize: true,// configService.get<boolean>('DB_SYNC') ||
//       }),
//       inject: [ConfigService],
//     }),
//     AuthModule
//   ],
//   controllers: [],
//   providers: [],
// })
// export class AppModule {}

