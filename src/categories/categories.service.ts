import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CategoryRepository } from './category.repository';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './category.entity';
import { CategoryType } from './category-type.enum';

@Injectable()
export class CategoriesService {
  constructor(private readonly repo: CategoryRepository) {}

  async create(userId: string, dto: CreateCategoryDto): Promise<Category> {
    const { name, type } = dto;
    const exists = await this.repo.existsByNameType(userId, name, type);
    if (exists) {
      throw new ConflictException('La categoría ya existe para ese tipo.');
    }
    return this.repo.createForUser(userId, name, type);
  }

  async findAll(userId: string, type?: CategoryType): Promise<Category[]> {
    return this.repo.getAll(userId, type);
  }

  async findOne(userId: string, id: string): Promise<Category> {
    const found = await this.repo.findById(id, userId);
    if (!found) throw new NotFoundException('Categoría no encontrada');
    return found;
  }

  async remove(userId: string, id: string): Promise<void> {
    const cat = await this.findOne(userId, id);
    await this.repo.remove(cat);
  }
}