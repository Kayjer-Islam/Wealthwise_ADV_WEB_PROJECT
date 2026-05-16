import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BudgetsService } from './budgets.service';
import { BudgetsController } from './budgets.controller';
import { Budget } from './budget.entity';
import { Category } from '../categories/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Budget, Category])],
  controllers: [BudgetsController],
  providers: [BudgetsService],
  exports: [TypeOrmModule],
})
export class BudgetsModule {}
