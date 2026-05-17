import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/user.entity';

@Controller('categories')
@UseGuards(JwtAuthGuard)
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post('global')
  createGlobal(@Body() dto: CreateCategoryDto, @Req() req) {
    return this.categoriesService.createGlobal(dto, req.user);
  }

  @Post('personal')
  createPersonal(@Body() dto: CreateCategoryDto, @Req() req) {
    return this.categoriesService.createPersonal(dto, req.user);
  }

  @Get()
  findAll(@Req() req) {
    return this.categoriesService.findAllForUser(req.user);
  }
}
