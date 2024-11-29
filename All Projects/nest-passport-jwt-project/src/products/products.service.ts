import { Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { In, Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { AdminGetUserCommand } from '@aws-sdk/client-cognito-identity-provider';
import { cognito } from 'config/aws.config';



@Injectable()
export class ProductsService {

  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

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

    const product = this.productsRepository.create({
      ...createProductDto,
      userId, 
    });

    const savedProduct = await this.productsRepository.save(product);

    console.log('Saved Product:', savedProduct);

    return savedProduct;
  } catch (error) {
    console.error('Error creating the product:', error.message);
    throw error; 
  }

}















  // function for posting a new Product
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






  
  
  
  
 
 // Function for getting a product by id with user details
// function for getting a product by id
async findOne(id: string): Promise<Product> {

  try {

    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['users'],
    });

    if (!product) throw new NotFoundException(`Product with given id ${id} not found!`);

    console.log(`Product with given id ${id} is:` , product);

    return product;

  } catch (error) {
    console.error('Error finding product:', error);
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
