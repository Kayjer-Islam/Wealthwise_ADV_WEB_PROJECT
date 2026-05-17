import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Or, IsNull } from 'typeorm';
import { Category } from './category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { User } from '../users/user.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepo: Repository<Category>,
  ) {}

  private sanitize(category: Category) {
    if (category.createdBy) delete (category.createdBy as any).password;
    return category;
  }

  async createGlobal(dto: CreateCategoryDto, admin: User): Promise<Category> {
    const existing = await this.categoryRepo.findOne({
      where: { name: dto.name, isPersonal: false },
    });
    if (existing) throw new ConflictException('Global category already exists');

    const category = this.categoryRepo.create({
      name: dto.name,
      isPersonal: false,
      createdBy: admin,
    });
    const saved = await this.categoryRepo.save(category);
    return this.sanitize(saved);
  }

  async createPersonal(dto: CreateCategoryDto, user: User): Promise<Category> {
    const existing = await this.categoryRepo.findOne({
      where: { name: dto.name, isPersonal: true, createdBy: { id: user.id } },
    });
    if (existing) throw new ConflictException('Personal category already exists');

    const category = this.categoryRepo.create({
      name: dto.name,
      isPersonal: true,
      createdBy: user,
    });
    const saved = await this.categoryRepo.save(category);
    return this.sanitize(saved);
  }

  async findAllForUser(user: User): Promise<Category[]> {
    const categories = await this.categoryRepo.find();
    return categories
      .filter(
        (c) =>
          !c.isPersonal ||
          (c.isPersonal && c.createdBy?.id === user.id),
      )
      .map((c) => this.sanitize(c));
  }

  async findById(id: number): Promise<Category> {
    const category = await this.categoryRepo.findOne({ where: { id } });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }
}
