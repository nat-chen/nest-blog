import { RolesGuard, Roles } from './../auth/role.guard';
import { AuthGuard } from '@nestjs/passport';
import { CreatePostDto, PostsRo } from './dto/create-post.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PostsService } from './posts.service';

@ApiTags('文章')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  // 创建文章
  @ApiOperation({ summary: '创建文章' })
  @Post()
  @Roles('admin', 'root')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async create(@Body() post: CreatePostDto, @Req() req) {
    return await this.postsService.create(req.user, post);
  }

  // 获取所有文章
  @ApiOperation({ summary: '获取所有文章' })
  @Get('/list')
  async findAll(
    @Query() query,
    @Query('pageSize') pageSize: number,
    @Query('pageNum') pageNum: number,
  ): Promise<PostsRo> {
    return await this.postsService.findAll(query);
  }

  // 获取归档列表
  @ApiOperation({ summary: '归档日期列表' })
  @Get('/archives')
  getArchives() {
    return this.postsService.getArchives();
  }

  // 获取文章归档
  @ApiOperation({ summary: '文章归档' })
  @Get('/archives/list')
  getArchiveList(@Query('time') time: string) {
    return this.postsService.getArchiveList(time);
  }

  // 获取指定文章
  @ApiOperation({ summary: '获取指定文章' })
  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.postsService.findById(id);
  }

  // 更新文章
  @ApiOperation({ summary: '更新指定文章' })
  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(@Param('id') id: number, @Body() post: CreatePostDto) {
    return await this.postsService.updateById(id, post);
  }

  // 删除
  @ApiOperation({ summary: '删除文章' })
  @Delete('id')
  async remove(@Param('id') id) {
    return await this.postsService.remove(id);
  }
}
