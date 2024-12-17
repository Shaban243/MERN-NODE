import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './products/dto/create-product.dto';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProductDto extends PartialType(CreateProductDto) {


  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

   @ApiProperty()
  @IsString()
  @IsOptional()
  description: string;

}
