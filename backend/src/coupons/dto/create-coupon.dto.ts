import { IsDateString, IsInt, IsNotEmpty, Max, Min } from "class-validator";

export class CreateCouponDto {
    @IsNotEmpty({message: 'El nombre del cupón es obligatorio'})
    name: string;
    
   @IsNotEmpty({message: 'El porcentaje es obligatorio'})
   @IsInt({message: 'El porcentaje debe ser un número entero'})
   @Max(100, {message: 'El porcentaje no puede ser mayor a 100'})
   @Min(1, {message: 'El porcentaje debe ser al menos 1'})
   percentage: number;
   
    @IsNotEmpty({message: 'La fecha de expiración es obligatoria'})
    @IsDateString({},{message: 'La fecha de expiración debe ser una fecha válida'})
    expirationDate: Date;
}
