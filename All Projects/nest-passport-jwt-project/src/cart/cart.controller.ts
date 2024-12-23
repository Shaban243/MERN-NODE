import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CognitoAccessToken } from 'amazon-cognito-identity-js';
import { CognitoAuthGuard } from 'src/auth/gurards/cognito.guard';
import { RolesGuard } from 'src/auth/gurards/roles.guard';
import { Roles } from 'src/auth/gurards/roles.decorator';
import { Role } from 'src/auth/roles.enum';
import { stat } from 'fs';


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
@ApiResponse({
  status: 201,
  description: 'Product successfully added to the cart',
  schema: {
    example: {
      statusCode: 201,
      message: 'Product successfully added into cart',
    },
  },
})
@ApiResponse({
  status: 404,
  description: 'Product not found or not created by an admin',
  schema: {
    example: {
      statusCode: 404,
      message: 'Product not found or not created by an admin',
      error: 'NotFound',
    },
  },
})
async addProductToCart(@Req() req, @Body() createCartDto: CreateCartDto) {
  try {
    const user = req.user; 
    return this.cartService.addProductToCart(user, createCartDto);
  } catch (error) {
    if (error instanceof NotFoundException) {
      throw error; 
    }
    throw new InternalServerErrorException('An unexpected error occurred while adding the product to the cart');
  }
}








@Delete('delete/:productId')
@UseGuards(CognitoAuthGuard, RolesGuard)
@Roles([Role.User])
@ApiBearerAuth()
@ApiOperation({ summary: 'Delete product from Cart (User access)' })
@ApiResponse({
  status: 200,
  description: 'Product successfully removed from the cart',
  schema: {
    example: {
      statusCode: 200,
      message: 'Product successfully removed from the cart',
    },
  },
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
async deleteProductFromCart(@Req() req, @Param('productId') productId: string) {
  try {
    const user = req.user;
    return this.cartService.deleteProductFromCart(user, productId);
  } catch (error) {
    if (error instanceof NotFoundException) {
      throw error; 
    }
    throw new NotFoundException('An unexpected error occurred while removing the product from the cart');
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
