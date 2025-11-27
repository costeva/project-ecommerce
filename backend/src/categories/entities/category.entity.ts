import { Product } from '../../products/entities/product.entity';
import {BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';


@Entity()
export class Category extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 60, unique: true })
    name: string;

    @OneToMany(()=> Product, (product) => product.category, {cascade:true}) //cascade sirve al agregar un producto con categoria nueva, se crea la categoria automaticamente.
    products: Product[];

}
