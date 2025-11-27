import e from "express";
import { Product } from "../../products/entities/product.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Transaction {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('decimal')
    total: number;

    @Column({type:'varchar', length:30, nullable:true})
    coupon: string;

    @Column({type:'decimal', nullable:true, default:0})
    discount: number;

    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)'})
    createdAt: Date;


     @OneToMany(() => TransactionContent, (transaction) => transaction.transaction)
    constens: TransactionContent[];

}
@Entity()
export class TransactionContent {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('int')
    quantity: number;

    @Column('decimal')
    price: number;

    @ManyToOne(() => Product, (product) => product.id, {eager:true, cascade:true})
    product: Product;


    @ManyToOne(() => Transaction, (transaction) => transaction.constens, {cascade:true})
    transaction: Transaction;

}
