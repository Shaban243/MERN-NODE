import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { IsString, IsNumber, IsEmpty, IsNotEmpty } from 'class-validator';

export class UpdateProductDto extends PartialType(CreateProductDto) {

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  description?: string;

}
