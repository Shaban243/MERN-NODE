import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateCartDto } from './create-cart.dto';

export class UpdateCartDto extends PartialType(CreateCartDto) {

    @ApiProperty()
    productId: string;

    @ApiProperty()
    quantity: number;
}
