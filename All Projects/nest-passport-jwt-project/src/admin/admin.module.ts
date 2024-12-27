import { forwardRef, Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './entities/admin.entity';
import { AdminRepository } from './admin.repository';
import { TypeORMError } from 'typeorm';
import { UsersModule } from 'src/users/users.module';

@Module({

  imports: [TypeOrmModule.forFeature([Admin]),
  forwardRef(() => UsersModule) ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService, TypeOrmModule],

})

export class AdminModule { }
