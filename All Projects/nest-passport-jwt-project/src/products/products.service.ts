import { Inject, Injectable, InternalServerErrorException, NotFoundException, ForbiddenException, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Multer } from 'multer';
import { In, Not, Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { AdminGetUserCommand } from '@aws-sdk/client-cognito-identity-provider';
import { cognito } from 'config/aws.config';
import { Role } from 'src/auth/roles.enum';
import { UploadService } from 'src/services/upload.service';



@Injectable()
export class ProductsService {

  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,

    private readonly uploadService: UploadService,

    // @InjectRepository(User)
    // private readonly usersRepository: Repository<User>,

  ) { }




  // function for creating a new Product
  async createProduct(
    _createProductDto: CreateProductDto,
    imageFile: Express.Multer.File
  ): Promise<{ message: string, savedProduct: any }> {

    try {

      const productData = this.productsRepository.create({ ..._createProductDto });

      let image_url = null;

      if (imageFile) {
        const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        const fileExtension = imageFile.originalname.split('.').pop()?.toLowerCase();

        if (!allowedExtensions.includes(fileExtension)) {
          throw new BadRequestException(
            'Invalid file type. Only image files (jpg, jpeg, png, gif) are allowed.',
          );
        }
      }

      if (imageFile) {
        image_url = await this.uploadService.uploadFile(imageFile);
      }

      productData.image_url = image_url;
      const savedProduct = await this.productsRepository.save(productData);

      return {
        message: "Created product details are: ",
        savedProduct
      }

    } catch (error) {

      console.error('Error creating product:', error);

      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to create product');
    }

  }






  // Function for updating Product Image
  async updateProductImage(ProductId: string, image_url: string): Promise<void> {

    try {

      await this.productsRepository.update(ProductId, { image_url });

    } catch (error) {

      console.error(`Error updating image URL for Product ID ${ProductId}:`, error.message);

      throw new InternalServerErrorException('Failed to update product image URL');
    }

  }







  // function for gettig a list of all Products
  async findAll(): Promise<Product[]> {

    try {
      const products = await this.productsRepository.find();

      if (!products) {
        throw new NotFoundException('No products record found!');
      }

      return products;

    } catch (error) {

      console.error('Error retrieving products: ', error);

      if (error.name === 'NotFoundException') {
        throw new NotFoundException('No products record found');
      }

      throw new InternalServerErrorException('Failed to retrieve products!');
    }

  }








  // Function for getting the product by id
  async getProductById(productId: string): Promise<Product> {

    try {

      const product = await this.productsRepository.findOne({
        where: { id: productId },
        relations: ['cart', 'cart.user'],
      });

      if (!product) {
        throw new NotFoundException(`Product with given id ${productId} not found!`);
      }

      return product;

    } catch (error) {

      if (error instanceof NotFoundException) {
        throw error;

      } else if (error.name === 'QueryFailedError') {
        throw new BadRequestException('Invalid Product Id format, Please enter correct Id for retrieving the product record!')
      }

      throw new InternalServerErrorException('Failed to fetch the product details!');
    }

  }










  // function for Updating a Product by id
  async update(productId: string, _updateProductDto: UpdateProductDto): Promise<any> {

    try {

      const product = await this.productsRepository.findOne({ where: { id: productId } });

      if (!product) {
        throw new NotFoundException(`Product with id ${productId} not found`);
      }

      const result = await this.productsRepository.update(productId, _updateProductDto);

      if (result.affected === 0) {
        throw new NotFoundException(`Product with id ${productId} not found`);
      }

      const updatedProduct = await this.productsRepository.findOne({ where: { id: productId } });
      console.log(`Product with id ${productId} updated successfully.`);

      return {
        message: `Product with given id ${productId} updated successfully!`,
        product: updatedProduct
      };


    } catch (error) {
      console.error('Error updating the product record', error.message);

      if (error instanceof NotFoundException) {
        throw error;

      } else if (error.name === 'QueryFailedError') {
        throw new BadRequestException('Invalid product Id format, Please enter correct Id for updating the product record!')
      }

      throw new InternalServerErrorException('Failed to update product record!');
    }

  }










  // function for deleting a Product by id
  async remove(id: string): Promise<{ message: string, deletedProduct: Product }> {

    try {

      const product = await this.productsRepository.findOne({ where: { id } });

      if (!product) {
        throw new NotFoundException(`Product with given id ${id} not found!`);
      }

      const deletedProduct = await this.productsRepository.remove(product);

      return {
        message: `product with given id ${id} deleted successfully, The deleted product details are: `,
        deletedProduct
      };

    } catch (error) {
      console.error('Error Deleting product:', error);

      if (error instanceof NotFoundException) {
        throw error;

      } else if (error.name === 'QueryFailedError') {
        throw new BadRequestException('Invalid product Id format, Please enter correct Id for updating the product record!')
      }

      throw new InternalServerErrorException('Failed to delete product record with given id');
    }

  }


}
