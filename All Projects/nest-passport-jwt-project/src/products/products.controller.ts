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
  ForbiddenException,
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
  // usersService: any;
  constructor(
    private readonly productsService: ProductsService,
    private readonly uploadService: UploadService,
  ) { }





  // Route for creating a new Product
  @Post('createproduct')
  @UseGuards(CognitoAuthGuard, RolesGuard)
  @Roles([Role.SuperAdmin, Role.ProductAssistantAdmin])
  @UseInterceptors(FileInterceptor('file'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new product (Super-Admin && Product-Assistant Admin)' })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        name: { type: "string" },
        description: { type: "string" },
        file: {
          type: "string",
          format: "binary"
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  @ApiResponse({ status: 500, description: 'Failed to create Product' })

  async createProduct(
    @Req() req,
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() file: Express.Multer.File
  ) {

    const user = req.user;

    try {
      const result = await this.productsService.createProduct(createProductDto, file);
      console.log('Product created data is: ', result);

      return result;
    } catch (error) {
      console.error('Error creating product', error.message);
      throw new BadRequestException('Failed to create product');
    }

  }





  // Route for create product for specific user
  @Post('createProduct/:username')
  @UseGuards(CognitoAuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Roles([Role.SuperAdmin])
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new product for a specific user (Super-Admin)' })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        username: { type: "string" },
        name: { type: "string" },
        description: { type: "string" },
        file: {
          type: "string",
          format: "binary"
        },
      },
      required: ["username"]
    },  
  })

  @ApiResponse({ status: 201, description: 'Product created successfully for the user' })
  @ApiResponse({ status: 500, description: 'Failed to create product for the user' })

  async createProductForUser(
    @Body() createProductDto: { name: string; description: string; username: string },
    @UploadedFile() file: Express.Multer.File
  ) {

    try {
      const { username, ...productData } = createProductDto;

      const product = this.productsService.createProductForUser(
        createProductDto,
        username,
        file
      );

      return product;
    } catch (error) {
      console.error('Error creating the product', error.message);
      throw new ForbiddenException('Only superAdmin can create the product for user');
    }

  }






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
  @Post(':id/uploadimage')
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(CognitoAuthGuard, RolesGuard)
  @Roles([Role.SuperAdmin, Role.ProductAssistantAdmin])
  @ApiOperation({ summary: 'Upload an image for a specific product (Super-Admin && Product-Assistant Admin)' })
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Product ID for which the image is being uploaded', type: String })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })

  @ApiResponse({ status: 201, description: 'Image uploaded successfully' })
  @ApiResponse({ status: 500, description: 'Failed to upload product image' })
  async uploadProductImage(
    // Function for uploading a new productImage
    @Param('id') ProductId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {

    try {
      const image_url = await this.uploadService.uploadFile(
        file,
        `product/${ProductId}`,
      );
      await this.productsService.updateProductImage(ProductId, image_url);

      return { image_url };
    } catch (error) {
      console.error(
        `Error uploading the image for product ID ${ProductId}:`,
        error.message,
      );
      throw new InternalServerErrorException('Failed to upload product image');
    }

  }






  // Route for getting a list of all products
  @Get('getAllProducts')
  @ApiBearerAuth()
  @UseGuards(CognitoAuthGuard, RolesGuard)
  @Roles([Role.SuperAdmin, Role.ProductAssistantAdmin])
  @ApiOperation({ summary: 'Retrieve a list of all products (Super-Admin access && Product-Assistant Admin access)' })
  @ApiResponse({ status: 200, description: 'Products retrieved successfully' })
  @ApiResponse({ status: 500, description: 'Failed to retrieve products' })

  async findAll() {

    try {
      const products = await this.productsService.findAll();
      return products;
    } catch (error) {
      console.error('Error retrieving the products!', error.message);
      throw new NotFoundException('No Products record found!');
    }

  }






  // Route for getting a product by id
  @Get('getProduct/:id')
  @ApiBearerAuth()
  @UseGuards(CognitoAuthGuard, RolesGuard)
  @Roles([Role.SuperAdmin, Role.ProductAssistantAdmin])
  @ApiOperation({ summary: 'Retrieve a product by ID (Super-Admin access && Product-Assistant Admin access)' })
  @ApiParam({ name: 'id', description: 'Product ID to retrieve', type: String })
  @ApiResponse({ status: 200, description: 'Product retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })

  async findOne(@Param('id') id: string) {

    try {
      const product = await this.productsService.findOne(id);
      return product;
    } catch (error) {
      console.error(`Product with ID ${id} not found`, error.message);
      throw new NotFoundException(`No Product record with given id ${id} found!`);
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
  @ApiResponse({ status: 404, description: 'Product not found' })

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
      throw new InternalServerErrorException('Failed to update product attributes!');
    }

  }







  // Route for deleting a product by id
  @Delete('deleteProduct/:id')
  @ApiBearerAuth()
  @UseGuards(CognitoAuthGuard, RolesGuard)
  @Roles([Role.SuperAdmin, Role.ProductAssistantAdmin])
  @ApiOperation({ summary: 'Delete a product by ID (Super-Admin access && Product-Assistant Admin access)' })
  @ApiParam({ name: 'id', description: 'Product ID to delete', type: String })
  @ApiResponse({ status: 200, description: 'Product deleted successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })

  async remove(@Param('id') id: string) {

    try {
      const deletedProduct = await this.productsService.remove(id);
      return deletedProduct;
    } catch (error) {
      console.error(`Product with ID ${id} not found`, error.message);
      throw new NotFoundException('No product record with given id found!');
    }
  }

}
