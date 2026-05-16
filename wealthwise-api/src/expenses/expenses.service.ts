import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expense } from './expense.entity';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { User } from '../users/user.entity';
import { Category } from '../categories/category.entity';
import { Budget } from '../budgets/budget.entity';
import { MailerService } from '../mailer/mailer.service';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository(Expense)
    private expenseRepo: Repository<Expense>,
    @InjectRepository(Category)
    private categoryRepo: Repository<Category>,
    @InjectRepository(Budget)
    private budgetRepo: Repository<Budget>,
    private mailerService: MailerService,
  ) {}

  private sanitize(expense: Expense) {
    if (expense.user) delete (expense.user as any).password;
    if (expense.category?.createdBy) delete (expense.category.createdBy as any).password;
    return expense;
  }

  async create(dto: CreateExpenseDto, user: User): Promise<any> {
    const category = await this.categoryRepo.findOne({
      where: { id: dto.categoryId },
    });
    if (!category) throw new NotFoundException('Category not found');

    const expense = this.expenseRepo.create({
      amount: dto.amount,
      description: dto.description,
      user,
      category,
    });
    const saved = await this.expenseRepo.save(expense);

    // Check budget and send alert if exceeded
    const budget = await this.budgetRepo.findOne({
      where: { user: { id: user.id }, category: { id: dto.categoryId } },
    });

    if (budget) {
      const allExpenses = await this.expenseRepo.find({
        where: { user: { id: user.id }, category: { id: dto.categoryId } },
      });
      const totalSpent = allExpenses.reduce((sum, e) => sum + Number(e.amount), 0);

      if (totalSpent > Number(budget.limitAmount)) {
        this.mailerService.sendBudgetAlert(
          { name: user.name, email: user.email },
          category.name,
          Number(budget.limitAmount),
          totalSpent,
        );
      }
    }

    return {
      ...this.sanitize(saved),
      message: 'Expense added successfully',
    };
  }

  async findMyExpenses(user: User) {
    const expenses = await this.expenseRepo.find({
      where: { user: { id: user.id } },
      order: { createdAt: 'DESC' },
    });

    const sanitized = expenses.map((e) => this.sanitize(e));
    const total = sanitized.reduce((sum, e) => sum + Number(e.amount), 0);
    return { total, count: sanitized.length, expenses: sanitized };
  }

  async delete(id: number, user: User): Promise<{ message: string }> {
    const expense = await this.expenseRepo.findOne({ where: { id } });
    if (!expense) throw new NotFoundException('Expense not found');
    if (expense.user.id !== user.id)
      throw new ForbiddenException('You can only delete your own expenses');

    await this.expenseRepo.remove(expense);
    return { message: 'Expense deleted successfully' };
  }
}
