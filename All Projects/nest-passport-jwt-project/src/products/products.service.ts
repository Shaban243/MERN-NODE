import { Inject, Injectable, InternalServerErrorException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { In, Not, Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { AdminGetUserCommand } from '@aws-sdk/client-cognito-identity-provider';
import { cognito } from 'config/aws.config';
import { Role } from 'src/auth/roles.enum';



@Injectable()
export class ProductsService {

  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,

    // @InjectRepository(User)
    // private readonly usersRepository: Repository<User>,

  ) { }





  // Function for adding products to a user
  async createProductForUser(createProductDto: CreateProductDto, username: string): Promise<Product> {

    try {
      const params = {
        UserPoolId: process.env.COGNITO_USER_POOL_ID,
        Username: username,
      };


      const command = new AdminGetUserCommand(params);
      const response = await cognito.send(command);

      if (!response) {
        throw new NotFoundException(`User with username ${username} not found in Cognito`);
      }

      const userId = response.UserAttributes.find(attr => attr.Name === 'sub')?.Value;

      if (!userId) {
        throw new NotFoundException(`User's 'sub' ID not found in Cognito`);
      }

      const role = response.UserAttributes.find(attr => attr.Name === 'custom:role')?.Value;


      if (role !== Role.SuperAdmin) {
        throw new ForbiddenException('Only superAdmin can create the product for user');
      }

      const product = this.productsRepository.create({
        ...createProductDto,
        userId,
      });

      const savedProduct = await this.productsRepository.save(product);

      console.log('Saved Product:', savedProduct);

      return savedProduct;
    } catch (error) {
      console.error('Error creating the product:', error.message);
      throw new ForbiddenException('Only superAdmin can create the product for user');
    }

  }















  // function for creating a new Product
  async createProduct(_createProductDto: CreateProductDto): Promise<Product> {

    try {
      console.log('_createProductDto', CreateProductDto);

      const product = this.productsRepository.create({ ..._createProductDto });

      console.log('product ', product);

      return await this.productsRepository.save(product);

    } catch (error) {
      console.error('Error creating product:', error);
      throw new Error('Failed to create product');
    }

  }






  // Function for updating Product Image
  async updateProductImage(ProductId: string, image_url: string): Promise<void> {

    try {
      await this.productsRepository.update(ProductId, { image_url });
      console.log(`Image URL updated for Product ID: ${ProductId}`);

    } catch (error) {
      console.error(`Error updating image URL for Product ID ${ProductId}:`, error.message);
      throw new InternalServerErrorException('Failed to update product image URL');
    }

  }







  // function for gettig a list of all Products
  async findAll(): Promise<Product[]> {

    try {
      const products = await this.productsRepository.find();
      console.log('All products data is: ', products);

      return products;

    } catch (error) {
      console.error('Error retrieving products: ', error);
      throw new Error('Failed to retrieve products');
    }

  }









  // Function for getting product data with user details

  async findOne(id: string): Promise<any> {
    try {

      const product = await this.productsRepository.findOne({
        where: { id },
        relations: ['users'],
      });

      if (!product) {
        throw new NotFoundException(`Product with given id ${id} not found!`);
      }

      console.log(`Product found:`, product);

      // const userId = product?.userId; 
      // console.log('User Id is: ', userId);

      // if (!userId) {
      //   throw new NotFoundException(`No associated userId found for product with id ${id}`);
      // }

      // const cognitoParams = {
      //   UserPoolId: process.env.COGNITO_USER_POOL_ID,
      //   Username: userId,  
      // };

      // const cognitoCommand = new AdminGetUserCommand(cognitoParams);
      // const cognitoResponse = await cognito.send(cognitoCommand);

      // console.log('Cognito Response is: ', cognitoResponse);

      // if (!cognitoResponse || !cognitoResponse.UserAttributes) {
      //   throw new NotFoundException(`User with sub-id ${userId} does not exist in Cognito.`);
      // }


      // const user = cognitoResponse.UserAttributes.reduce((acc, attr) => {
      //   acc[attr.Name] = attr.Value;
      //   return acc;
      // }, {});


      return {
        product: product,
        // user: user,       
      };

    } catch (error) {
      console.error('Error finding product and user:', error);
      throw error;
    }
  }










  // function for Updating a Product by id
  async update(id: string, _updateProductDto: UpdateProductDto): Promise<Product> {

    try {

      const product = await this.findOne(id);
      console.log(`Product with given id ${id} is: `, product);

      if (!product) throw new NotFoundException(`Product with given id ${id} not found!`);
      const updatedProduct = Object.assign(product, _updateProductDto);

      console.log(`Updated Product with given id ${id} is: `, updatedProduct);
      return this.productsRepository.save(updatedProduct);

    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }

  }







  // function for deleting a Product by id
  async remove(id: string): Promise<Product> {

    try {

      const product = await this.productsRepository.findOne({ where: { id } });
      if (!product) throw new NotFoundException(`Product with given id ${id} not found!`);

      const deletedProduct = await this.productsRepository.remove(product);
      console.log('The deleted product is: ', deletedProduct);

      return deletedProduct;

    } catch (error) {
      console.error('Error Deleting product:', error);
      throw error;
    }

  }


}
