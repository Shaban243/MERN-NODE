import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateProductDto {

    @ApiProperty({description: 'username', required: true})
    @IsString()
    @IsNotEmpty()
    username: string;

    @ApiProperty({description: 'name', required: true})
    @IsString()
    @IsNotEmpty()
    name: string;
  
    @ApiProperty({description: 'description', required: true})
    @IsString()
    description: string;

}
