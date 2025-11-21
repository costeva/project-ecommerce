import { IsNotEmpty, IsString,IsNumber,IsInt } from "class-validator";

export class CreateProductDto {

@IsNotEmpty({ message: 'El nombre es obligatorio' })
@IsString({ message: 'El nombre debe ser una cadena de texto' })
name: string;

@IsNotEmpty({ message: 'El precio es obligatorio' })
@IsNumber({ maxDecimalPlaces: 2 }, { message: 'El precio debe ser un número válido' })
price: number;

@IsNotEmpty({ message: 'El stock es obligatorio' })
@IsNumber({ maxDecimalPlaces: 0 }, { message: 'El stock cantidad no valida' })
stock: number;

@IsNotEmpty({ message: 'La descripción es obligatoria' })
@IsString({ message: 'La descripción debe ser una cadena de texto' })
description: string;

@IsNotEmpty({ message: 'La categoría es obligatoria' })
@IsInt( { message: 'La categoría debe ser un número válido' })
categoryId: number;


}
