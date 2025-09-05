import {
  Body, Controller, Get, Post, Query, UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { QueryTransactionsDto } from './dto/query-transactions.dto';
import { KpisDto } from './dto/kpis.dto';
import { GetUserId } from 'src/common/decorators/get-user-id.decorator';

@UseGuards(AuthGuard('jwt'))
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly service: TransactionsService) {}

  @Post()
  async create(@GetUserId() userId: string, @Body() dto: CreateTransactionDto) {
    return this.service.create(userId, dto);
  }

  @Get()
  async list(@GetUserId() userId: string, @Query() q: QueryTransactionsDto) {
    return this.service.list(userId, q);
  }

  @Get('kpis')
  async kpis(@GetUserId() userId: string) {
    return this.service.kpis(userId);
  }

  @Get('by-category')
  async byCategory(
  @GetUserId() userId: string,
  @Query('type') type?: 'INCOME' | 'EXPENSE',
  @Query() q?: KpisDto,
  ) {
    return this.service.totalsByCategory(userId, type as any, q?.start, q?.end);
  }

  @Get('latest')
  async latest(@GetUserId() userId: string, @Query('limit') limit?: number) {
    return this.service.latest(userId, limit ? Number(limit) : 5);
  }

  @Get('kpis/by-category')
  async kpisByCategory(
    @GetUserId() userId: string
  ) {
    return this.service.totalsByCategoryBoth(userId);
  }
}