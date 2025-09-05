import { Injectable } from '@nestjs/common';
import { DataSource, ILike, Repository } from 'typeorm';
import { Category } from './category.entity';
import { CategoryType } from './category-type.enum';

@Injectable()
export class CategoryRepository extends Repository<Category> {
  constructor(ds: DataSource) {
    super(Category, ds.createEntityManager());
  }

  async createForUser(
    userId: string,
    name: string,
    type: CategoryType,
  ): Promise<Category> {
    const cat = this.create({ userId, name: name.trim(), type });
    return this.save(cat);
  }

  async findById(id: string, userId: string): Promise<Category | null> {
    return this.findOne({ where: { id, userId } });
  }

  async existsByNameType(
    userId: string,
    name: string,
    type: CategoryType,
  ): Promise<boolean> {
    const found = await this.findOne({
      where: { userId, type, name: ILike(name.trim()) },
    });
    return !!found;
  }

  async getAll(userId: string, type?: CategoryType): Promise<Category[]> {
    return this.find({
      where: { userId, ...(type ? { type } : {}) },
      order: { name: 'ASC' },
      select: ['id', 'name', 'type'],
    });
  }
}