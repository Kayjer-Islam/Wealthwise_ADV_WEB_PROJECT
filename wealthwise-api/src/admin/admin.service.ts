import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { Expense } from '../expenses/expense.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Expense)
    private expenseRepo: Repository<Expense>,
  ) {}

  async getAllUsers() {
    const users = await this.userRepo.find();
    return users.map((u) => {
      delete (u as any).password;
      return u;
    });
  }

  async getAllExpenses() {
    const expenses = await this.expenseRepo.find({
      order: { createdAt: 'DESC' },
    });
    return expenses.map((e) => {
      if (e.user) delete (e.user as any).password;
      if (e.category?.createdBy) delete (e.category.createdBy as any).password;
      return e;
    });
  }

  async getAllReports() {
    const users = await this.userRepo.find();
    const expenses = await this.expenseRepo.find();

    const report = users.map((user) => {
      const userExpenses = expenses.filter((e) => e.user?.id === user.id);
      const total = userExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
      return {
        userId: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        totalExpenses: total,
        expenseCount: userExpenses.length,
      };
    });

    return {
      totalUsers: users.length,
      report,
    };
  }

  async deleteUser(id: number) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    await this.userRepo.remove(user);
    return { message: 'User deleted successfully' };
  }
}
