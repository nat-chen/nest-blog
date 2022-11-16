import { CategoryEntity } from './entities/category.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  async create(name: string) {
    return await this.categoryRepository.save({ name });
  }

  async findById(id) {
    return await this.categoryRepository.findOne(id);
  }
}
