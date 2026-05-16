import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { Expense } from '../expenses/expense.entity';
import { Budget } from '../budgets/budget.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Expense, Budget])],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
