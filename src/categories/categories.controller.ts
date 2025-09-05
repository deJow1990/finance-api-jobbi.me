import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  ParseEnumPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryType } from './category-type.enum';
import { GetUserId } from 'src/common/decorators/get-user-id.decorator';

@UseGuards(AuthGuard('jwt'))
@Controller('categories')
export class CategoriesController {
  constructor(private readonly service: CategoriesService) {}

  @Post()
  async create(
    @GetUserId() userId: string,
    @Body() dto: CreateCategoryDto,
  ) {
    return this.service.create(userId, dto);
  }

  @Get()
  async findAll(
    @GetUserId() userId: string,
    @Query('type', new ParseEnumPipe(CategoryType, { optional: true }))
    type?: CategoryType,
  ) {
    return this.service.findAll(userId, type);
  }

  @Get(':id')
  async findOne(
    @GetUserId() userId: string,
    @Param('id') id: string,
  ) {
    return this.service.findOne(userId, id);
  }

  @Delete(':id')
  async remove(
    @GetUserId() userId: string,
    @Param('id') id: string,
  ) {
    await this.service.remove(userId, id);
    return { ok: true };
  }
}