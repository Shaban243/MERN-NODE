import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto, ERoles, UserInterface } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { LoginInterface } from 'src/auth/dto/login.dto';
import { Product } from 'src/products/entities/product.entity';
import { ProductsService } from 'src/products/products.service';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,

    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    private readonly productsService: ProductsService,
  ) { }

  async createAdmin(createAdminDto: UserInterface) {

    const isAdmin = await this.usersRepository.findOne({
      where: { role: ERoles.Admin },
    });
    console.log({ isAdmin });

    if (isAdmin) {
      throw new ConflictException('Admin already Registered!');
    }
    const admin = await this.create({
      ...createAdminDto,
      role: ERoles.Admin,
    });

    return admin;
  }



  // Post a new user
  async create(createUserDto: UserInterface) {

    const isExist = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (isExist) {
      throw new ConflictException('User Already exist with this email!');
    }
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    console.log('Data of newly created user is: ', user);

    return await this.usersRepository.save(user);

  }



  // Validate User
  async validateUser(authPayload: LoginInterface): Promise<any> {

    const { email, password } = authPayload;
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('No userRegistered with this email!');
    }

    const isAuthenticated = await bcrypt.compare(password, user.password);
    if (!isAuthenticated) {
      throw new UnauthorizedException('Incorrect Email or password!');
    }

    return user;

  }



  // Retrieve all users
  async findAll(): Promise<User[]> {

    try {
      return this.usersRepository.find();
    } catch (error) {
      console.error('Error retrieving users', error);
      throw new Error('Failed to retrieve users');
    }

  }



  // Retrieve user by id
  async findOne(id: number): Promise<User> {

    try {
      const user = await this.usersRepository.findOne({
        where: { id },
        relations: ['products'],
      });

      if (!user)    throw new NotFoundException(`User with given id ${id} not found!`);

      if (user.id === 42) {
        const productIdsToAssociate = [21, 23];
        const currentProductIds = user.products.map( product => product.id);


        const productsToAdd = productIdsToAssociate.filter(
          productId => !currentProductIds.includes(productId)
        );


        if(productsToAdd.length > 0)
        await this.productsService.associateProductsWithUser(user, productsToAdd);


        return this.usersRepository.findOne({
          where: { id },
          relations: ['products']
        });

      }

      if (user.id === 46 && user.products.length === 0) {
        const productIdsToAssociate = [22];
        // const currentProductIds = productIdsToAssociate.map( product => product.id);

        const productsToAdd = productIdsToAssociate.filter(
          (productId) => !user.products.some(product => product.id === productId)
        );

        if(productsToAdd.length > 0)
        await this.productsService.associateProductsWithUser(user, productsToAdd);

        return this.usersRepository.findOne({
          where : { id },
          relations: ['products']
        });

      }

      console.log('Fetched User is: ', user);
      return user;
    } catch (error) {
      console.error('Error retrieving user', error);
      throw error;
    }

  }



  // Update user by id
  async update(id: number, _updateUserDto: UpdateUserDto): Promise<User> {

    try {
      const user = await this.findOne(id);
      console.log(`User with given id ${id} is: `, user);

      if (!user)
        throw new NotFoundException(`User with given id ${id} not found`);

      if (_updateUserDto.password) {
        const hashedPassword = await bcrypt.hash(_updateUserDto.password, 10);
        _updateUserDto.password = hashedPassword;
      }

      const updatedUser = Object.assign(user, _updateUserDto);
      console.log(`Updated user with given id ${id} is: `, updatedUser);

      return this.usersRepository.save(updatedUser);
    } catch (error) {
      console.error('Error updating user', error);
      throw error;
    }

  }



  // Deleting a user by id
  async remove(id: number): Promise<void> {

    try {
      const user = await this.usersRepository.findOne({ where: { id } });
      if (!user)
        throw new NotFoundException(`User with given id ${id} not found`);

      await this.usersRepository.remove(user);
    } catch (error) {
      console.error('Error deleting user');
      throw error;
    }

  }



}
