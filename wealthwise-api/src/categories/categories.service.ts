import {
  Injectable,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { User } from '../users/user.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepo: Repository<Category>,
  ) {}

  async create(dto: CreateCategoryDto, admin: User): Promise<Category> {
    const existing = await this.categoryRepo.findOne({
      where: { name: dto.name },
    });
    if (existing) throw new ConflictException('Category already exists');

    const category = this.categoryRepo.create({
      name: dto.name,
      createdBy: admin,
    });
    return this.categoryRepo.save(category);
  }

  async findAll(): Promise<Category[]> {
    return this.categoryRepo.find();
  }
}