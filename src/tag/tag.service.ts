import { TagEntity } from './entities/tag.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(TagEntity)
    private readonly tagRepository: Repository<TagEntity>,
  ) {}

  async create(name) {
    return await this.tagRepository.save({ name });
  }

  async findByIds(ids: string[]) {
    return this.tagRepository.findBy({ id: In(ids) });
  }
}
