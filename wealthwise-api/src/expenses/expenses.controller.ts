import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('expenses')
@UseGuards(JwtAuthGuard)
export class ExpensesController {
  constructor(private expensesService: ExpensesService) {}

  @Post()
  create(@Body() dto: CreateExpenseDto, @Req() req) {
    return this.expensesService.create(dto, req.user);
  }

  @Get('my')
  findMy(@Req() req) {
    return this.expensesService.findMyExpenses(req.user);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @Req() req) {
    return this.expensesService.delete(+id, req.user);
  }
}
