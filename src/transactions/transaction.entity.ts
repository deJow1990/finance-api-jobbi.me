import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from 'src/categories/category.entity';
import { User } from 'src/users/user.entity';
import { CategoryType } from 'src/categories/category-type.enum';

const numericTransformer = {
  to: (v?: number) => v,
  from: (v: string | null) => (v == null ? null : Number(v)),
};

@Entity({ name: 'transactions' })
@Index(['userId', 'occurredAt'])
@Index(['userId', 'type'])
@Index(['userId', 'categoryId'])
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'uuid', name: 'category_id' })
  categoryId: string;

  @ManyToOne(() => Category, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({ type: 'enum', enum: CategoryType })
  type: CategoryType;

  @Column({ type: 'numeric', precision: 14, scale: 2, transformer: numericTransformer })
  amount: number;

  @Column({ name: 'occurred_at', type: 'timestamp with time zone' })
  occurredAt: Date;

  @Column({ type: 'character varying', length: 255, nullable: true })
  note?: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;
}