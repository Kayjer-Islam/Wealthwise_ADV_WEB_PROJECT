import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class UpdateBudgetDto {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  limitAmount: number;
}
