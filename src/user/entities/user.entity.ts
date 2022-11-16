import { PostsEntity } from './../../posts/posts.entity';
import {
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Entity('user')
export class User {
  @ApiProperty({ description: '用户id' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, nullable: true })
  username: string;

  @Column({ length: 100, nullable: true })
  nickname: string;

  @Column({ select: false, nullable: true })
  @Exclude()
  password: string;

  @Column({ default: null })
  avatar: string;

  @Column({ default: null })
  email: string;

  @Column({ default: null })
  openid: string;

  @Column('enum', { enum: ['root', 'author', 'visitor'], default: 'visitor' })
  role: string;

  @OneToMany(() => PostsEntity, (post) => post.author)
  posts: PostsEntity[];

  @Column({
    name: 'create_time',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createTime: Date;

  @Exclude()
  @Column({
    name: 'update_time',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updateTime: Date;

  @BeforeInsert()
  async encryptPwd() {
    if (!this.password) return;
    this.password = await bcrypt.hashSync(this.password);
  }
}
