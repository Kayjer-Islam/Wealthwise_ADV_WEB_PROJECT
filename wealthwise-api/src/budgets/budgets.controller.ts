import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { BudgetsService } from './budgets.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('budgets')
@UseGuards(JwtAuthGuard)
export class BudgetsController {
  constructor(private budgetsService: BudgetsService) {}

  @Post()
  create(@Body() dto: CreateBudgetDto, @Req() req) {
    return this.budgetsService.create(dto, req.user);
  }

  @Get()
  findMy(@Req() req) {
    return this.budgetsService.findMyBudgets(req.user);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateBudgetDto, @Req() req) {
    return this.budgetsService.update(+id, dto, req.user);
  }
}
