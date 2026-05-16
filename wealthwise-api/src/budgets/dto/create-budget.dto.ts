import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class CreateBudgetDto {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  limitAmount: number;

  @IsNotEmpty()
  @IsNumber()
  categoryId: number;
}
