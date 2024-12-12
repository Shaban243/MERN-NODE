import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
export declare class ProductsService {
    private readonly productsRepository;
    constructor(productsRepository: Repository<Product>);
    createProductForUser(createProductDto: CreateProductDto, username: string): Promise<Product>;
    createProduct(_createProductDto: CreateProductDto): Promise<Product>;
    updateProductImage(ProductId: string, image_url: string): Promise<void>;
    findAll(): Promise<Product[]>;
    findOne(id: string): Promise<any>;
    update(id: string, _updateProductDto: UpdateProductDto): Promise<Product>;
    remove(id: string): Promise<Product>;
}
