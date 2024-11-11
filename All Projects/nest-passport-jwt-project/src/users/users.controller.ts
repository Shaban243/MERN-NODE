import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, ERoles } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/gurards/jwt.guard';
import { RolesGuard } from 'src/auth/gurards/roles.guard';
import { Roles } from 'src/auth/gurards/roles.decorator';
import { promises } from 'dns';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post(ERoles.Admin)
  @UsePipes(new ValidationPipe())
  async createAdmin(@Body() createAdminDto: CreateUserDto) {
    console.log('createUserDto', createAdminDto);
    return await this.usersService.createAdmin(createAdminDto);
  }

  @Post('newUser')
  @Roles(ERoles.Admin)
  // @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe())
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @Roles(ERoles.Admin)
  // @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  async findAll(@Req() req) {
    console.log({ user: req.user });
    return this.usersService.findAll();
  } 

  @Get(':id')
  async findOne(@Param('id') id: number) : Promise<User> {
    const user = await this.usersService.findOne(+id);
    return user;
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  // @Roles('admin')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
