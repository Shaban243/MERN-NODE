import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateProductDto extends PartialType(CreateProductDto) {


  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

}
