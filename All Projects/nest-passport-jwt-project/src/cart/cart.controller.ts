import { Controller, Post, Body, Param, Delete, Req, UseGuards, NotFoundException, InternalServerErrorException, Put, BadRequestException } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CognitoAuthGuard } from 'src/auth/gurards/cognito.guard';
import { RolesGuard } from 'src/auth/gurards/roles.guard';
import { Roles } from 'src/auth/gurards/roles.decorator';
import { Role } from 'src/auth/roles.enum';
import { NotFound } from '@aws-sdk/client-s3';
import { UpdateCartDto } from './dto/update-cart.dto';


@ApiTags('Cart')
@Controller('cart')

export class CartController {
  constructor(
    private readonly cartService: CartService,
  ) { }






  @Post('addProduct')
  @UseGuards(CognitoAuthGuard, RolesGuard)
  @Roles([Role.User])
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add product into cart (User access)' })
  @ApiResponse({ status: 201, description: 'Product successfully added to the cart' })
  @ApiResponse({
    status: 404,
    description: 'NotFound',
    schema: {
      example: {
        statusCode: 404,
        message: 'Product not found or not created by an admin',
        error: 'NotFound',
      },
    },
  })
  @ApiResponse({
    status: 500, description: 'Failed to update cart-item product quantity into cart!'
  })
  async addProductToCart(@Req() req, @Body() createCartDto: CreateCartDto) {

    try {

      const user = req.user;

      return this.cartService.addProductToCart(user, createCartDto);

    } catch (error) {

      if (error instanceof NotFoundException) {
        throw error;
      }

      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException('An unexpected error occurred while adding the product to the cart');
    }

  }






  @Put('updateProductQuantity')
  @UseGuards(CognitoAuthGuard, RolesGuard)
  @Roles([Role.User])
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update the cart-item product quantity (User-access) ' })
  @ApiBody({ type: UpdateCartDto })
  @ApiResponse({
    status: 201, description: 'Cart item product quantity updated successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'BadRequest',
    schema: {
      example: {
        statusCode: 400,
        message: 'Invalid product Id format, Please enter correct Id for updating the product quantity!',
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
        message: 'Cart-item product with given id not found in cart!',
        error: 'NotFound'
      }
    }
  })
  @ApiResponse({
    status: 500, description: 'Failed to update cart-item product quantity',
  })
  async updateProductInCart(
    @Req() req,
    @Body('productId') productId: string,
    @Body('quantity') quantity: number,
  ) {

    try {

      const userId = req.user.id;

      return await this.cartService.updateProductInCart(userId, productId, quantity);

    } catch (error) {

      if (error instanceof NotFoundException) {
        throw error;
      }

      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to update cart-item product in cart!');
    }

  }








  @Delete('deleteProduct/:productId')
  @UseGuards(CognitoAuthGuard, RolesGuard)
  @Roles([Role.User])
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete product from Cart (User access)' })
  @ApiResponse({
    status: 200,
    description: 'Product successfully removed from the cart',
  })
  @ApiResponse({
    status: 400,
    description: 'BadRequest',
    schema: {
      example: {
        statusCode: 400,
        message: 'Invalid product Id format, Please enter correct Id for deleting the product record!',
        error: ':BadRequest'
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found in the cart',
    schema: {
      example: {
        statusCode: 404,
        message: 'Product not found in the cart',
        error: 'NotFound',
      },
    },
  })
  async deleteProductFromCart(
    @Req() req,
    @Param('productId') productId: string
  ) {

    try {

      const user = req.user;

      return this.cartService.deleteProductFromCart(user, productId);

    } catch (error) {

      if (error instanceof NotFoundException) {
        throw error;
      }

      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException('An unexpected error occurred while removing the product from the cart');
    }

  }







  // create(@Body() createCartDto: CreateCartDto) {
  //   return this.cartService.create(createCartDto);
  // }

  // @Get()
  // findAll() {
  //   return this.cartService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.cartService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateCartDto: UpdateCartDto) {
  //   return this.cartService.update(+id, updateCartDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.cartService.remove(+id);
  // }
}
