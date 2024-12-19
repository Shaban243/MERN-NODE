import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateProductDto {

    @ApiProperty({ description: 'The user ID for whom the product is being created', required: true })
    @IsString()
    @IsNotEmpty()
    userId: string;

    @ApiProperty({description: 'name', required: true})
    @IsString()
    @IsNotEmpty()
    name: string;
  
    @ApiProperty({description: 'description', required: true})
    @IsString()
    description: string;

}
