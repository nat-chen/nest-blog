import { CreateTagDto } from './dto/create-tag.dto';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { TagService } from './tag.service';

@ApiTags('标签')
@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @ApiOperation({ summary: '创建标签' })
  @Post()
  create(@Body() body: CreateTagDto) {
    return this.tagService.create(body.name);
  }
}
