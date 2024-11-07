import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';


@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) { }



  // Post a new user
  async create(_createUserDto: CreateUserDto) {

    try {
      console.log('_createUserDto', CreateUserDto);

      const hashedPassword = await bcrypt.hash(_createUserDto.password, 10);

      const user = this.usersRepository.create({ ..._createUserDto, password: hashedPassword});
      console.log('Data of newly created user is: ', user);

      return await this.usersRepository.save(user);

    } catch (error) {
      console.error('Error creating user: ', error);
      throw new Error('Failed to create user');
    }

  }


// Retrieve all users
  async findAll() : Promise<User[]> {

    try {
      return this.usersRepository.find();

    } catch (error) {
      console.error('Error retrieving users', error);
      throw new Error('Failed to retrieve users');
    }
   
  }


// Retrieve user by id
  async findOne(id: number) : Promise<User>{

    try {
     const user =  await this.usersRepository.findOne({ where : { id }});
      if(!user)  throw new NotFoundException(`User with given id ${id} not found!`);

      return user;

    } catch (error) {
      console.error('Error retrieving user', error);
      throw error;
    }
   
  }


  // Update user by id
  async update(id: number, _updateUserDto: UpdateUserDto) : Promise<User> {
    
    try {
      const user = await this.findOne(id);
      console.log(`User with given id ${id} is: `, user);

      if(!user) throw new NotFoundException(`User with given id ${id} not found`);

      const updatedUser = Object.assign(user, _updateUserDto);
      console.log(`Updated user with given id ${id} is: `, updatedUser);

      return this.usersRepository.save(updatedUser);

    } catch (error) {
      console.error('Error updating user', error);
      throw error;
    }

  }



  // Deleting a user by id
  async remove(id: number) : Promise<void>{

    try {
      const user = await this.usersRepository.findOne({ where : { id } });
      if(!user) throw new NotFoundException(`User with given id ${id} not found`);

      await this.usersRepository.remove(user);

    } catch (error) {
      console.error('Error deleting user');
      throw error;
    }
    
  }


}
