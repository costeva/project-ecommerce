import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindManyOptions, Not, Repository } from 'typeorm';
import { Transaction, TransactionContent } from './entities/transaction.entity';
import { Product } from '../products/entities/product.entity';
import { endOfDay, isValid, parseISO,startOfDay } from 'date-fns';
import { CouponsService } from '../coupons/coupons.service';


@Injectable()
export class TransactionsService {

  constructor(
    @InjectRepository(Transaction) private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(TransactionContent) private readonly transactionContentRepository: Repository<TransactionContent>,
    @InjectRepository(Product) private readonly productRepository: Repository<Product>,
    private readonly couponsService: CouponsService
  ) {}

 async create(createTransactionDto: CreateTransactionDto) {

    await this.productRepository.manager.transaction(async(transactionEntityManager)=>{
       const transaction = new Transaction();
       const total = createTransactionDto.contents.reduce((total, item) => total + (item.price * item.quantity), 0);
        transaction.total = total;

        if(createTransactionDto.coupon){
          const coupon = await this.couponsService.applyCoupon(createTransactionDto.coupon);
          const discount = (coupon.percentage / 100) * total;
          transaction.discount = discount;
          transaction.coupon = coupon.name;
          transaction.total -=  discount;
        }
      
    
    for(const contents of createTransactionDto.contents){
      const product = await transactionEntityManager.findOneBy(Product, {id: contents.productId});

      const errors: string[] = [];
      if (!product) {
       errors.push(`Product with id ${contents.productId} not found`);
       throw new NotFoundException(errors);
      }

      if(contents.quantity > product.stock){
        errors.push(`The product with id ${contents.productId} has not enough stock. Available stock: ${product.stock}`);
        throw new BadRequestException(errors);
      }
      product.stock -= contents.quantity;
      //create the transaction content intance

      const transactionContent = new TransactionContent();
      transactionContent.price = contents.price;
      transactionContent.product = product;
      transactionContent.quantity = contents.quantity;
      transactionContent.transaction = transaction;
      await transactionEntityManager.save(transaction);
      await transactionEntityManager.save(transactionContent);
    }
    })
   

    return "Venta Almacenada Correctamente"


 }   


  findAll(transactionDate?: string) {
    const options:FindManyOptions<Transaction>={
      relations: { constens:true},
    }
    if(transactionDate){
      const date = parseISO(transactionDate);
      if(!isValid(date)){
        throw new BadRequestException('Invalid date format');
      }
      const start = startOfDay(date);
      const end= endOfDay(date);
      options.where = {
        createdAt: Between(start, end)
      }
    }

    return this.transactionRepository.find(options);
  }

 async findOne(id: number) {
   const transaction = await this.transactionRepository.findOne({
     where: { id },
     relations: { constens: true }
   });
   if (!transaction) {
     throw new NotFoundException(`Transaction with id ${id} not found`);
   }
   return transaction;
  }

 /*  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  } */

  async remove(id: number) {
    const transaction = await this.findOne(id);
    for(const content of transaction.constens){
        const product = await this.productRepository.findOneBy({id: content.product.id});
        if(product){
          product.stock += content.quantity;
          await this.productRepository.save(product);
        }
      const transactionContent = await this.transactionContentRepository.findOneBy({id: content.id});
      if (transactionContent) {
        await this.transactionContentRepository.remove(transactionContent);
      }
    }

    
    
    await this.transactionRepository.remove(transaction);

    return { message: `Transaction with id ${id} has been removed` };
  }
}
