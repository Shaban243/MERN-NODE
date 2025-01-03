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





  // Function for adding products to a user
  // Function for adding products to a user
  // async createProductForUser(
  //   createProductDto: CreateProductDto,
  //   file: Express.Multer.File
  // ): Promise<any> {
  //   const {  name, description } = createProductDto;

  //   try {


  //     if (file) {
  //       const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];
  //       const fileExtension = file.originalname.split('.').pop()?.toLowerCase();

  //       if (!allowedExtensions.includes(fileExtension)) {
  //         throw new BadRequestException(
  //           'Invalid file type. Only image files (jpg, jpeg, png, gif) are allowed.'
  //         );
  //       }
  //     }

  // const params = {
  //   UserPoolId: process.env.COGNITO_USER_POOL_ID,
  //   Username: userId,
  // };

  // console.log('Params:', params);

  // const command = new AdminGetUserCommand(params);
  // console.log('command is: ', command);
  // console.log('My data')
  // const response = await cognito.send(command);
  // console.log('response is: ', response);


  // const userRole = response.UserAttributes.find((attr) => attr.Name === 'custom:role')?.Value;
  // console.log('User Role:', userRole);

  // const fetchedUserId = response.UserAttributes.find((attr) => attr.Name === 'sub')?.Value;
  // console.log('Fetched UserId from Cognito:', fetchedUserId);

  // if (fetchedUserId !== userId) {
  //   throw new HttpException(`User with userId ${userId} not found in Cognito`, HttpStatus.NOT_FOUND);
  // }

  //     console.log('UserId matches, proceeding with product creation.');


  //     const product = this.productsRepository.create({
  //       name,
  //       description,
  //       // userId,
  //     });

  //     const savedProduct = await this.productsRepository.save(product);
  //     console.log('Saved Product:', savedProduct);

  //     let imageUrl = null;

  //     if (file) {
  //       imageUrl = await this.uploadService.uploadFile(file, `product/${product.id}`);
  //       savedProduct.image_url = imageUrl;
  //       await this.productsRepository.save(savedProduct);
  //     }

  //     return { savedProduct };
  //   } catch (error) {
  //     console.error('Error in createProductForUser:', error.message);

  //     if (error instanceof HttpException) {
  //       throw error;
  //     }

  //     if (error instanceof BadRequestException) {
  //       throw error;
  //     }

  //     throw new InternalServerErrorException('Failed to create product for specific user.');
  //   }
  // }
















  // function for creating a new Product
  async createProduct(
    _createProductDto: CreateProductDto,
    imageFile: Express.Multer.File
  ): Promise<Product> {

    try {

      const product = this.productsRepository.create({ ..._createProductDto });

      const savedProduct = await this.productsRepository.save(product);

      let image_url = null;

      if (imageFile) {
        const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];
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

      savedProduct.image_url = image_url;

      return await this.productsRepository.save(savedProduct);

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
      
      if(!products) {
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









  // Function for getting product data with user details

  // async findOne(id: string): Promise<any> {
  //   try {

  //     const product = await this.productsRepository.findOne({
  //       where: { id },
  //       relations: ['users'],
  //     });

  //     if (!product) {
  //       throw new NotFoundException(`Product with given id ${id} not found!`);
  //     }

  //     console.log(`Product found:`, product);

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


  //     return {
  //       product: product,
  //       // user: user,       
  //     };

  //   } catch (error) {
  //     console.error('Error finding product and user:', error);
  //     throw new NotFoundException('No Product record with given id found!');
  //   }
  // }




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

      } else if(error.name === 'QueryFailedError') {
        throw new BadRequestException('Invalid product Id format, Please enter correct Id for updating the product record!')
      }

      throw new InternalServerErrorException('Failed to update product record!');
    }

  }










  // function for deleting a Product by id
  async remove(id: string): Promise<{message: string, deletedProduct: Product}> {

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

      } else if(error.name === 'QueryFailedError') {
        throw new BadRequestException('Invalid product Id format, Please enter correct Id for updating the product record!')
      }

      throw new InternalServerErrorException('Failed to delete product record with given id');
    }

  }


}
