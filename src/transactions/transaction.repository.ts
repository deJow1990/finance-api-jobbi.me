import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Transaction } from './transaction.entity';
import { EntryType } from './entry-type.enum';
import { CategoryType } from 'src/categories/category-type.enum';
import { CategoryTotalRow, TotalsByCategoryResult } from './dto/totals-by-category.dto';

@Injectable()
export class TransactionRepository extends Repository<Transaction> {
  constructor(ds: DataSource) {
    super(Transaction, ds.createEntityManager());
  }

  async createForUser(params: {
    userId: string;
    categoryId: string;
    type: CategoryType;
    amount: number;
    occurredAt: Date;
    note?: string;
  }): Promise<Transaction> {
    const tx = this.create(params);
    return this.save(tx);
  }

  async listForUser(params: {
    userId: string;
    type?: EntryType;
    categoryId?: string;
    start?: Date;
    end?: Date;
    limit?: number;
    offset?: number;
  }): Promise<Transaction[]> {
    const { userId, type, categoryId, start, end, limit, offset } = params;

    const qb = this.createQueryBuilder('t')
      .leftJoinAndSelect('t.category', 'c')
      .where('t.userId = :userId', { userId })
      .orderBy('t.occurredAt', 'DESC');

    if (type) qb.andWhere('t.type = :type', { type });
    if (categoryId) qb.andWhere('t.categoryId = :categoryId', { categoryId });
    if (start) qb.andWhere('t.occurredAt >= :start', { start });
    if (end) qb.andWhere('t.occurredAt <= :end', { end });
    if (limit != null) qb.limit(limit);
    if (offset != null) qb.offset(offset);

    return qb.getMany();
  }

  async totalsForUser(userId: string): Promise<{ totalIncome: number; totalExpense: number; net: number }> {
    const row = await this.createQueryBuilder('t')
      .select(`COALESCE(SUM(t.amount) FILTER (WHERE t.type = :inc AND t.userId = :userId), 0)`, 'totalIncome')
      .addSelect(`COALESCE(SUM(t.amount) FILTER (WHERE t.type = :exp AND t.userId = :userId), 0)`, 'totalExpense')
      .setParameters({ inc: CategoryType.INCOME, exp: CategoryType.EXPENSE, userId })
      .getRawOne<{ totalIncome: string; totalExpense: string }>();

    const totalIncome = Number(row?.totalIncome ?? 0);
    const totalExpense = Number(row?.totalExpense ?? 0);
    return { totalIncome, totalExpense, net: totalIncome - totalExpense };
  }

  async totalsByCategoryForUser(params: {
    userId: string;
    type?: CategoryType;
    start?: Date;
    end?: Date;
  }) {
    const { userId, type, start, end } = params;

    const qb = this.createQueryBuilder('t')
      .innerJoin('t.category', 'c')
      .select('c.id', 'categoryId')
      .addSelect('c.name', 'categoryName')
      .addSelect('SUM(t.amount)', 'total')
      .where('t.userId = :userId', { userId })
      .groupBy('c.id')
      .addGroupBy('c.name')
      .orderBy('total', 'DESC');

    if (type) qb.andWhere('t.type = :type', { type });
    if (start) qb.andWhere('t.occurredAt >= :start', { start });
    if (end) qb.andWhere('t.occurredAt <= :end', { end });

    const rows = await qb.getRawMany<{ categoryId: string; categoryName: string; total: string }>();
    return rows.map(r => ({ ...r, total: Number(r.total) }));
  }

  async latestForUser(userId: string, limit = 5): Promise<Transaction[]> {
    return this.createQueryBuilder('t')
      .leftJoinAndSelect('t.category', 'c')
      .where('t.userId = :userId', { userId })
      .orderBy('t.occurredAt', 'DESC')
      .limit(limit)
      .getMany();
  }

  async totalsByCategoryBoth(
    userId: string
  ): Promise<TotalsByCategoryResult> {
    const qb = this.createQueryBuilder('t')
      .innerJoin('t.category', 'c')
      .select('c.name', 'categoryName')
      .addSelect('t.type', 'type')
      .addSelect('COALESCE(SUM(t.amount), 0)', 'total')
      .where('t.userId = :userId', { userId });

    qb.groupBy('c.name').addGroupBy('t.type');

    const rows = await qb.getRawMany<{
      categoryName: string;
      type: EntryType;
      total: string;
    }>();

    const income: CategoryTotalRow[] = [];
    const expense: CategoryTotalRow[] = [];

    for (const r of rows) {
      const item = {
        categoryName: r.categoryName,
        total: Number(r.total ?? 0),
      };
      if (r.type === EntryType.INCOME) income.push(item);
      else if (r.type === EntryType.EXPENSE) expense.push(item);
    }

    return { income, expense };
  }
}