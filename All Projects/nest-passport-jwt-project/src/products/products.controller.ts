import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  UseInterceptors,
  UploadedFile,
  InternalServerErrorException,
  UseGuards,
  Req,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';

import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from 'services/upload.service';
import { Roles } from 'src/auth/gurards/roles.decorator';
import { Role } from 'src/auth/roles.enum';
import { CognitoAuthGuard } from 'src/auth/gurards/cognito.guard';
import { RolesGuard } from 'src/auth/gurards/roles.guard';

@Controller('products')
export class ProductsController {
  
  constructor(
    private readonly productsService: ProductsService,
  ) { }





  // Route for creating a new Product
  @Post('createproduct')
  @UseGuards(CognitoAuthGuard, RolesGuard)
  @Roles([Role.User, Role.ProductAssistantAdmin, Role.SuperAdmin])
  @UseInterceptors(FileInterceptor('imageFile'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new product (Super-Admin access && ProductAssistant-Admin access' })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        name: { type: "string" },
        description: { type: "string" },
        imageFile: {
          type: "string",
          format: "binary"
        },
      },
      required: ['name'],
    },
  })
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  @ApiResponse({
    status: 400,
    description: 'BadRequest',
    schema: {
      example: {
        statusCode: 400,
        message: 'Invalid file type. Only image files (jpg, jpeg, png, gif) are allowed.',
        error: 'BadRequest',
      },
    },
  })
  @ApiResponse({ status: 500, description: 'Failed to create Product' })

  async createProduct(
    @Req() req,
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() file: Express.Multer.File
  ) {

    const user = req.user;

    try {

      const result = await this.productsService.createProduct(createProductDto, file);

      return result;

    } catch (error) {

      console.error('Error creating product', error.message);

      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to create product!');
    }

  }





  // Route for create product for specific user
  // @Post('createProduct/:userId')
  // @UseGuards(CognitoAuthGuard, RolesGuard)
  // @UseInterceptors(FileInterceptor('imageFile'))
  // @Roles([Role.User])
  // @ApiBearerAuth()
  // @ApiOperation({ summary: 'User can create or add the products into his/her card' })
  // @ApiConsumes('multipart/form-data')
  // @ApiBody({
  //   schema: {
  //     type: 'object',
  //     properties: {
  //       userId: { type: 'string' },
  //       name: { type: 'string' },
  //       description: { type: 'string' },
  //       imageFile: { type: 'string', format: 'binary' },
  //     },
  //     required: [ 'name'],
  //   },
  // })
  // @ApiResponse({ status: 201, description: 'Product created successfully for the user' })
  // @ApiResponse({
  //   status: 404,
  //   description: 'User with given id not found',
  //   schema: {
  //     example: {
  //       statusCode: 404,
  //       message: 'User with userId not found.',
  //       error: 'Not Found',
  //     },
  //   },
  // })
  // @ApiResponse({
  //   status: 400,
  //   description: 'Invalid file type. Only image files (jpg, jpeg, png, gif) are allowed.',
  //   schema: {
  //     example: {
  //       statusCode: 400,
  //       message:'Invalid file type. Only image files (jpg, jpeg, png, gif) are allowed.',
  //       error: 'BadRequest',
  //     },
  //   },
  // })
  // @ApiResponse({ status: 500, description: 'Failed to create product for the user' })
  // async createProductForUser(
  //   @Body() createProductDto: {  name: string; description: string },
  //   @UploadedFile() file: Express.Multer.File
  // ) {
  //   try {
      
  //     const product = await this.productsService.createProductForUser(createProductDto, file);
  //     return product;
  //   } catch (error) {
  //     console.error('Error in createProductForUser route:', error instanceof NotFoundException);
  
  //     if (error instanceof HttpException) {
  //       throw error;
  //     }
  
  //     throw new InternalServerErrorException('Failed to create the product for the user.');
  //   }
  // }
  





  // Route for getting product for specific user
  // @Get('user/:userId')
  // @ApiBearerAuth()
  // @UseGuards(CognitoAuthGuard, RolesGuard)
  // @Roles([Role.SuperAdmin])
  // @ApiOperation({ summary: 'Get all products for a specific user (Super-Admin-access only)' })
  // @ApiParam({ name: 'userId', description: 'User ID whose products are to be retrieved', type: String })
  // @ApiResponse({ status: 200, description: 'Products retrieved successfully' })
  // @ApiResponse({ status: 500, description: 'Failed to retrieve products' })

  // async getProductByUserId(@Param('userId') userId: string)   {

  //   try {
  //     const product = this.productsService.getProductByUserId(userId);
  //     return product;
  //   } catch (error) {
  //     console.error(
  //       `Error getting the product for userid ${userId}`,
  //       error.message,
  //     );
  //     throw error;
  //   }

  // }






  // Route for uploading Product Image by product id
  // @Post(':id/uploadimage')
  // @UseInterceptors(FileInterceptor('file'))
  // @UseGuards(CognitoAuthGuard, RolesGuard)
  // @Roles([Role.SuperAdmin, Role.ProductAssistantAdmin])
  // @ApiOperation({ summary: 'Upload an image for a specific product (Super-Admin && Product-Assistant Admin)' })
  // @ApiConsumes('multipart/form-data')
  // @ApiBearerAuth()
  // @ApiParam({ name: 'id', description: 'Product ID for which the image is being uploaded', type: String })
  // @ApiBody({
  //   schema: {
  //     type: 'object',
  //     properties: {
  //       file: {
  //         type: 'string',
  //         format: 'binary',
  //       },
  //     },
  //   },
  // })

  // @ApiResponse({ status: 201, description: 'Image uploaded successfully' })
  // @ApiResponse({ status: 500, description: 'Failed to upload product image' })
  // async uploadProductImage(
  //   // Function for uploading a new productImage
  //   @Param('id') ProductId: string,
  //   @UploadedFile() file: Express.Multer.File,
  // ) {

  //   try {
  //     const image_url = await this.uploadService.uploadFile(
  //       file,
  //       `product/${ProductId}`,
  //     );
  //     await this.productsService.updateProductImage(ProductId, image_url);

  //     return { image_url };
  //   } catch (error) {
  //     console.error(
  //       `Error uploading the image for product ID ${ProductId}:`,
  //       error.message,
  //     );
  //     throw new InternalServerErrorException('Failed to upload product image');
  //   }

  // }






  // Route for getting a list of all products
  @Get('getAllProducts')
  @ApiBearerAuth()
  @UseGuards(CognitoAuthGuard, RolesGuard)
  @Roles([Role.SuperAdmin, Role.ProductAssistantAdmin])
  @ApiOperation({ summary: 'Retrieve a list of all products (Super-Admin access && Product-Assistant Admin access)' })
  @ApiResponse({ status: 200, description: 'Products retrieved successfully' })
  @ApiResponse({
    status: 404,
    description: 'NotFound',
    schema: {
      example: {
        statusCode: 404,
        message: 'No products record found',
        error: 'NotFound'
      },
    },
  })
  @ApiResponse({ status: 500, description: 'Failed to retrieve products' })

  async findAll() {

    try {

      const products = await this.productsService.findAll();

      return products;

    } catch (error) {

      console.error('Error retrieving the products!', error.message);

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to retrieve products record!');
    }

  }






  // Route for getting a product by id
  @Get('getProduct/:id')
  @ApiBearerAuth()
  @UseGuards(CognitoAuthGuard, RolesGuard)
  @Roles([Role.SuperAdmin, Role.ProductAssistantAdmin])
  @ApiOperation({ summary: 'Retrieve a product by ID (Super-Admin access && Product-Assistant Admin access)' })
  @ApiResponse({ status: 200, description: 'Product retrieved successfully' })
  @ApiResponse({
    status: 400,
    description: 'BadRequest',
    schema: {
      example: {
        statusCode: 400,
        message: 'Invalid Product Id format, Please enter correct Id for retrieving the product record!',
        error: ':BadRequest'
      }
    }
  })
  @ApiResponse({ 
    status: 404, 
    description: 'NotFound',
    schema: {
      example: {
        statusCode: 404,
        message: `Product with given id not found!`,
        error: 'NotFound'
      }
    }
   })
   @ApiResponse({ 
    status:500,
    description: 'Failed to find the product with given id'
   })

  async findOne(@Param('id') id: string) {

    try {

      return await this.productsService.getProductById(id);

    } catch (error) {

      console.error(`Error finding the product with id ${id}`, error.message);

      if(error instanceof NotFoundException) {
        throw error;
      }

      if(error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException(`Failed to find the product with given id!`);
    }

  }






  // Route for updating a product by id
  @Put('updateProduct/:id')
  @ApiBearerAuth()
  @UseGuards(CognitoAuthGuard, RolesGuard)
  @Roles([Role.SuperAdmin, Role.ProductAssistantAdmin])
  @ApiOperation({ summary: 'Update a product by ID (Super-Admin access && Product-Assistant Admin access)' })
  @ApiParam({ name: 'id', description: 'Product ID to update', type: String })
  @ApiBody({ type: UpdateProductDto })
  @ApiResponse({ status: 200, description: 'Product updated successfully' })
  @ApiResponse({
    status: 400,
    description: 'BadRequest',
    schema: {
      example: {
        statusCode: 400,
        message: 'Invalid product Id format, Please enter correct Id for updating the product record!',
        error: ':BadRequest'
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'NotFound',
    schema: {
      example: {
        statusCode: 404,
        message: 'Product with given id not found',
        error: 'NotFound'
      }
    }
  })
  @ApiResponse({ status: 500, description: 'Failed to update product record' })

  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {

    try {

      const updatedProduct = await this.productsService.update(
        id,
        updateProductDto,
      );

      return updatedProduct;

    } catch (error) {
      
      console.error(`Product with ID ${id} not found`, error.message);

      if (error instanceof NotFoundException) {
        throw error;
      }  
      
      if(error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to update product record!');
    }

  }







  // Route for deleting a product by id
  @Delete('deleteProduct/:id')
  @ApiBearerAuth()
  @UseGuards(CognitoAuthGuard, RolesGuard)
  @Roles([Role.SuperAdmin, Role.ProductAssistantAdmin, Role.User])
  @ApiOperation({ summary: 'Delete a product by ID (Super-Admin access && Product-Assistant Admin access && User-access)' })
  @ApiParam({ name: 'id', description: 'Product ID to delete', type: String })
  @ApiResponse({ status: 200, description: 'Product deleted successfully' })
  @ApiResponse({
    status: 400,
    description: 'BadRequest',
    schema: {
      example: {
        statusCode: 400,
        message: 'Invalid product Id format, Please enter correct Id for updating the product record!',
        error: ':BadRequest'
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'NotFound',
    schema: {
      example: {
        statusCode: 404,
        message: 'Product with given id not found',
        error: 'NotFound'
      }
    }
  })
  @ApiResponse({ status: 500, description: 'Failed to delete product record!' })

  async remove(@Param('id') id: string) {

    try {
      return await this.productsService.remove(id);
     
    } catch (error) {
      console.error(`Product with ID ${id} not found`, error.message);

      if (error instanceof NotFoundException) {
        throw error;
      }  
      
      if(error instanceof BadRequestException) {
        throw error;
      }

      throw new NotFoundException('No product record with given id found!');
    }
  }

}
