import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpensesService } from './expenses.service';
import { ExpensesController } from './expenses.controller';
import { Expense } from './expense.entity';
import { Category } from '../categories/category.entity';
import { Budget } from '../budgets/budget.entity';
import { MailerModule } from '../mailer/mailer.module';

@Module({
  imports: [TypeOrmModule.forFeature([Expense, Category, Budget]), MailerModule],
  controllers: [ExpensesController],
  providers: [ExpensesService],
  exports: [TypeOrmModule],
})
export class ExpensesModule {}
