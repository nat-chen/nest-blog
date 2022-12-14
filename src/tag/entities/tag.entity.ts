import { PostsEntity } from './../../posts/posts.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('tag')
export class TagEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => PostsEntity, (post) => post.tags)
  posts: Array<PostsEntity>;

  @CreateDateColumn({
    type: 'timestamp',
    comment: '创建时间',
    name: 'create_time',
  })
  createTime: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    comment: '更新时间',
    name: 'update_time',
  })
  updateTime: Date;
}
