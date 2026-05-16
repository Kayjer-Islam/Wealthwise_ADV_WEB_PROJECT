import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expense } from '../expenses/expense.entity';
import { Budget } from '../budgets/budget.entity';
import { User } from '../users/user.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Expense)
    private expenseRepo: Repository<Expense>,
    @InjectRepository(Budget)
    private budgetRepo: Repository<Budget>,
  ) {}

  async getSummary(user: User) {
    const expenses = await this.expenseRepo.find({
      where: { user: { id: user.id } },
    });

    const budgets = await this.budgetRepo.find({
      where: { user: { id: user.id } },
    });

    const totalExpense = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

    // Group expenses by category
    const categoryMap: Record<string, { spent: number; budget: number | null; status: string }> = {};

    for (const expense of expenses) {
      const catName = expense.category?.name ?? 'Uncategorized';
      if (!categoryMap[catName]) {
        categoryMap[catName] = { spent: 0, budget: null, status: 'ok' };
      }
      categoryMap[catName].spent += Number(expense.amount);
    }

    // Attach budget limits to categories
    for (const budget of budgets) {
      const catName = budget.category?.name;
      if (catName && categoryMap[catName]) {
        categoryMap[catName].budget = Number(budget.limitAmount);
        categoryMap[catName].status =
          categoryMap[catName].spent > Number(budget.limitAmount)
            ? 'exceeded'
            : 'within limit';
      }
    }

    const categoryBreakdown = Object.entries(categoryMap).map(
      ([category, data]) => ({ category, ...data }),
    );

    return {
      totalExpense,
      totalCategories: categoryBreakdown.length,
      categoryBreakdown,
    };
  }
}
