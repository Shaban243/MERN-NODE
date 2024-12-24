import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsString, Min } from "class-validator";

export class CreateCartDto {

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    productId: string;


    @ApiProperty()
    @IsInt()
    @Min(1)
    quantity: number;


}
