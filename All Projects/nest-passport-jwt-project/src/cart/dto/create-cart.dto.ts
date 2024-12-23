import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsString, Min } from "class-validator";

export class CreateCartDto {

    @ApiProperty({ description: 'ID of the product to add to the cart'})
    @IsString()
    @IsNotEmpty()
    productId: string;


    @ApiProperty({ description: 'Quantity of the product', example: 1 })
    @IsInt()
    @Min(1)
    quantity: number;


}
