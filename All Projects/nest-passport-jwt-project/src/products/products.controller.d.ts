import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UploadService } from 'services/upload.service';
export declare class ProductsController {
    private readonly productsService;
    private readonly uploadService;
    constructor(productsService: ProductsService, uploadService: UploadService);
    createProduct(req: any, createProductDto: CreateProductDto): Promise<import("./entities/product.entity").Product>;
    createProductForUser(userId: string, createProductDto: CreateProductDto): Promise<import("./entities/product.entity").Product>;
    uploadProductImage(ProductId: string, file: Express.Multer.File): Promise<{
        image_url: string;
    }>;
    findAll(): Promise<import("./entities/product.entity").Product[]>;
    findOne(id: string): Promise<any>;
    update(id: string, updateProductDto: UpdateProductDto): Promise<import("./entities/product.entity").Product>;
    remove(id: string): Promise<import("./entities/product.entity").Product>;
}
