import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from 'services/upload.service';
import { Product } from './entities/product.entity';


@Controller('products')
export class ProductsController {
  usersService: any;
  constructor(
    private readonly productsService: ProductsService,
    private readonly uploadService: UploadService
  ) { }


  @Post('newProduct')

  async create(@Body() createProductDto: CreateProductDto)  {
      console.log('createProductDto', createProductDto);
      return await this.productsService.create(createProductDto);
  }


  
  // Function for uploading Product Image
  @Post(':id/uploadimage')
  @UseInterceptors(FileInterceptor('file'))

  async uploadProductImage(
    @Param('id') ProductId: number, 
    @UploadedFile() file: Express.Multer.File
  )   {

    const image_url = await this.uploadService.uploadFile(file, `product/${ProductId}`);
    await this.productsService.updateProductImage(ProductId, image_url);

    return { image_url};
  }

  @Get()

  async findAll() {
  return await this.productsService.findAll();
  }



  @Get(':id')

  async findOne(@Param('id') id: number) {
  const product = await this.productsService.findOne(+id);

  return product;
  }


  @Put(':id')

  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
  return await this.productsService.update(+id, updateProductDto);
  }



  @Delete(':id')

  async remove(@Param('id') id: string) {
  return await this.productsService.remove(+id);
  }


}
