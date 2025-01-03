import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { Repository } from 'typeorm';
import { Product } from 'src/products/entities/product.entity';
import { User } from 'src/users/entities/user.entity';


@Injectable()
export class CartService {

  constructor(

    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>

  ) { }




  // Function for adding the product to cart
  async addProductToCart(user: User, createCartDto: CreateCartDto): Promise<any> {

    try {

      const existingUser = await this.userRepository.findOne({
        where: { id: user.id }
      });

      if (!existingUser) {
        throw new NotFoundException('User not found');
      }

      const { productId, quantity } = createCartDto;

      const product = await this.productRepository.findOne({
        where: { id: productId, },
      });

      if (!product) {
        throw new NotFoundException('Product not found or not created by an admin');
      }

      let cartItem = await this.cartRepository.findOne({
        where: {
          user: { id: user.id },
          product: { id: product.id }
        },
      });

      if (cartItem) {
        cartItem.quantity += quantity;
      } else {
        cartItem = this.cartRepository.create({ quantity, user, product });
      }

      return await this.cartRepository.save(cartItem);

    } catch (error) {

      if (error instanceof NotFoundException) {
        throw error;

      } else if (error.name === 'QueryFailedError') {
        throw new BadRequestException('Invalid product Id format, Please enter correct Id for adding the product record into cart!')
      }

      throw new InternalServerErrorException('Failed to add product to the cart');
    }

  }








  // Function for updating the quantity of cart-item product
  async updateProductInCart(userId: string, productId: string, quantity: number): Promise<{ message: string, updatedItem }> {

    try {

      if (quantity <= 0) {
        throw new NotFoundException('Quantity must be greater than 0');
      }

      const cartItem = await this.cartRepository.findOne({
        where: {
          user: { id: userId },
          product: { id: productId }
        },     
        relations: ['user', 'product']
      });

      if (!cartItem) {
        throw new NotFoundException('Product not found in cart');
      }

      cartItem.quantity = quantity;

      const updatedItem = await this.cartRepository.save(cartItem);

      return {
        message: 'The product quantity in cart is successfully updated!',
        updatedItem
      }

    } catch (error) {

      if (error instanceof NotFoundException) {
        throw error;

      } else if (error.name === 'QueryFailedError') {
        throw new BadRequestException('Invalid product Id format, Please enter correct Id for updating the product quantity record!')
      }

      throw new InternalServerErrorException('Failed to update the cart-item product quantity');
    }

  }









  // Function for removing the product from cart
  async deleteProductFromCart(user: User, productId: string): Promise<{message: string, deletedItem}> {

    try {
      const cartItem = await this.cartRepository.findOne({
        where: {
          user: { id: user.id },
          product: { id: productId }
        },
      });

      if (!cartItem) {
        throw new NotFoundException('Product not found in the cart');
      }

      const deletedItem = this.cartRepository.remove(cartItem);

      return {
        message: `The cart-item product with given id ${productId} deleted successfully from cart!`,
        deletedItem
      }

    } catch (error) {

      if (error instanceof NotFoundException) {
        throw error;

      } else if (error.name === 'QueryFailedError') {
        throw new BadRequestException('Invalid product Id format, Please enter correct Id for deleting the product from cart!')
      }

      throw new InternalServerErrorException('Failed to remove product from the cart');
    }

  }



}





// create(createCartDto: CreateCartDto) {
//   return 'This action adds a new cart';
// }

// findAll() {
//   return `This action returns all cart`;
// }

// findOne(id: number) {
//   return `This action returns a #${id} cart`;
// }

// update(id: number, updateCartDto: UpdateCartDto) {
//   return `This action updates a #${id} cart`;
// }

// remove(id: number) {
//   return `This action removes a #${id} cart`;
// }

