import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Category } from 'src/categories/category.entity';
import { Transaction } from './transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { QueryTransactionsDto } from './dto/query-transactions.dto';
import { TransactionRepository } from './transaction.repository';
import { CategoryType } from 'src/categories/category-type.enum';
import { TotalsByCategoryResult } from './dto/totals-by-category.dto';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly ds: DataSource,
    private readonly repo: TransactionRepository,
  ) {}

  private parseRange(start?: string, end?: string) {
    const toDate = (s?: string) => (s ? new Date(s) : undefined);
    return { start: toDate(start), end: toDate(end) };
  }

  async create(userId: string, dto: CreateTransactionDto): Promise<Transaction> {
    const { categoryId, amount, occurredAt, note } = dto;

    const category = await this.ds.getRepository(Category).findOne({ where: { id: categoryId, userId } });
    if (!category) throw new NotFoundException('Categoría no encontrada');
    if (amount <= 0) throw new BadRequestException('El monto debe ser mayor a 0');

    return this.repo.createForUser({
      userId,
      categoryId,
      type: category.type,
      amount,
      occurredAt: new Date(occurredAt),
      note,
    });
  }

  async list(userId: string, q: QueryTransactionsDto) {
    const { start, end } = this.parseRange(q.start, q.end);
    return this.repo.listForUser({
      userId,
      type: q.type,
      categoryId: q.categoryId,
      start,
      end,
      limit: q.limit,
      offset: q.offset,
    });
  }

  async kpis(userId: string) {
    return this.repo.totalsForUser(userId);
  }

  async totalsByCategory(userId: string, type?: CategoryType, start?: string, end?: string) {
    const toDate = (s?: string) => (s ? new Date(s) : undefined);
    return this.repo.totalsByCategoryForUser({
      userId,
      type,
      start: toDate(start),
      end: toDate(end),
    });
  }

  async latest(userId: string, limit = 5) {
    return this.repo.latestForUser(userId, limit);
  }

  async totalsByCategoryBoth(
    userId: string
  ): Promise<TotalsByCategoryResult> {
    return this.repo.totalsByCategoryBoth(userId);
  }
}