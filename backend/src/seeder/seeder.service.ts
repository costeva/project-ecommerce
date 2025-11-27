import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../categories/entities/category.entity';
import { Product } from '../products/entities/product.entity';
import { Repository, DataSource } from 'typeorm';
import { categories } from './data/categories';
import { products } from './data/products';

@Injectable()
export class SeederService {
    constructor(
        @InjectRepository(Category) private readonly categoryRepository: Repository<Category>,
        @InjectRepository(Product) private readonly productRepository: Repository<Product>,
        private dataSource: DataSource,
    ) {}
//limpiar base de datos y sincronizar
   async onModuleInit() {
    const conextion = this.dataSource;
    await conextion.dropDatabase();
    await conextion.synchronize();
       
    }

    async seed() {
        // Implementa aquí tu lógica de seeding
      await this.categoryRepository.save(categories);
      for await (const seedProduct of products) {
        const category = await this.categoryRepository.findOneBy({id: seedProduct.categoryId});
        if (!category) {
          throw new Error(`Category with id ${seedProduct.categoryId} not found`);
        }
        const product = new Product();
        product.name = seedProduct.name;
        product.description = seedProduct.description;
        product.image = seedProduct.image;
        product.price = seedProduct.price;
        product.stock = seedProduct.stock;
        product.category = category;
        await this.productRepository.save(product);
      }
    }
}
