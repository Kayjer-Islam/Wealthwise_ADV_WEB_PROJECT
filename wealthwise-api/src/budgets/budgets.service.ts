import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Budget } from './budget.entity';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { User } from '../users/user.entity';
import { Category } from '../categories/category.entity';

@Injectable()
export class BudgetsService {
  constructor(
    @InjectRepository(Budget)
    private budgetRepo: Repository<Budget>,
    @InjectRepository(Category)
    private categoryRepo: Repository<Category>,
  ) {}

  private sanitize(budget: Budget) {
    if (budget.user) delete (budget.user as any).password;
    if (budget.category?.createdBy) delete (budget.category.createdBy as any).password;
    return budget;
  }

  async create(dto: CreateBudgetDto, user: User): Promise<Budget> {
    const category = await this.categoryRepo.findOne({
      where: { id: dto.categoryId },
    });
    if (!category) throw new NotFoundException('Category not found');

    const existing = await this.budgetRepo.findOne({
      where: { user: { id: user.id }, category: { id: dto.categoryId } },
    });
    if (existing)
      throw new ConflictException(
        'Budget for this category already exists. Use PATCH to update it.',
      );

    const budget = this.budgetRepo.create({
      limitAmount: dto.limitAmount,
      user,
      category,
    });
    const saved = await this.budgetRepo.save(budget);
    return this.sanitize(saved);
  }

  async findMyBudgets(user: User) {
    const budgets = await this.budgetRepo.find({
      where: { user: { id: user.id } },
      order: { createdAt: 'DESC' },
    });
    return budgets.map((b) => this.sanitize(b));
  }

  async update(id: number, dto: UpdateBudgetDto, user: User): Promise<Budget> {
    const budget = await this.budgetRepo.findOne({ where: { id } });
    if (!budget) throw new NotFoundException('Budget not found');
    if (budget.user.id !== user.id)
      throw new ForbiddenException('You can only update your own budgets');

    budget.limitAmount = dto.limitAmount;
    const saved = await this.budgetRepo.save(budget);
    return this.sanitize(saved);
  }
}
