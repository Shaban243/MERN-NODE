import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('newUser')

  @UsePipes(new ValidationPipe())
  async create(@Body() createUserDto: CreateUserDto) {
    console.log('createUserDto', CreateUserDto);
    return this.usersService.create(createUserDto);
  }


  @Get()

  async findAll() {
    return this.usersService.findAll();
  }


  @Get(':id')

  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }


  @Put(':id')

  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }


  @Delete(':id')

  async remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  
}
