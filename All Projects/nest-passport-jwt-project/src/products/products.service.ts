import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { In, Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ProductsService {

  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,

    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}



  // Function for associating the products to user
  async associateProductsWithUser(user: User, productIds: number[]): Promise<Product[]> {
    const products = await this.productsRepository.find({
      where : { id : In(productIds) }
    });
    
    for (const product of products) {
      product.user = user;
    }

    return this.productsRepository.save(products);
    }




  // Post a new Product
  async create(_createProductDto: CreateProductDto): Promise<Product> {

    try {
      console.log('_createProductDto', _createProductDto);
      
      const product = this.productsRepository.create(_createProductDto);
      console.log('product ', product);
      
      return await this.productsRepository.save(product);

    } catch (error) {
      console.error('Error creating product:', error);
      throw new Error('Failed to create product'); 
    }
    
  }
  



  // Get list of Products
  async findAll() : Promise<Product[]>{

    try {
      return this.productsRepository.find();
      
    } catch (error) {
      console.error('Error retrieving products: ', error);
      throw new Error('Failed to retrieve products');
    }

  }



  // Get product by id
  async findOne(id: number) : Promise<Product>{

    try {
      const product =  await this.productsRepository.findOne({
         where : { id },
         relations: ['user'],
        });
      if(!product) throw new NotFoundException(`Product with given id ${id} not found!`);

      console.log(`Product with given id ${id} is: `, product);
      return  product;



    } catch (error) {
      console.error('Error finding product:', error);
      throw  error;
    }

  }



  // Update Product by id
  async update(id: number, _updateProductDto: UpdateProductDto) : Promise<Product> {

    try {

      const product = await this.findOne(id);
      console.log(`Product with given id ${id} is: `, product);

      if(!product) throw new NotFoundException(`Product with given id ${id} not found!`);
      const updatedProduct = Object.assign(product, _updateProductDto);

      console.log(`Updated Product with given id ${id} is: `, updatedProduct);
      return this.productsRepository.save(updatedProduct);
      
    } catch (error) {
      console.error('Error updating product:', error);
      throw  error;
    }

  }


  // Delete Product by id
  async remove(id: number) : Promise<void> {

    try {

      const product = await this.productsRepository.findOne({ where : { id }});
      if(!product) throw new NotFoundException(`Product with given id ${id} not found!`);
      await this.productsRepository.remove(product);
      
    } catch (error) {
      console.error('Error Deleting product:', error);
      throw  error;
    }
    
  }


}
