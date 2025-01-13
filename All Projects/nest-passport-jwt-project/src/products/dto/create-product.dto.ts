import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateProductDto {

    @ApiProperty({description: 'name', required: true})
    @IsString()
    @IsNotEmpty()
    name: string;
  
    @ApiProperty({description: 'description'})
    @IsString()
    description: string;

}
