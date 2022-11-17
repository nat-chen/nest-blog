import { BadRequestException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { IStrategyOptions, Strategy } from 'passport-local';
import { compareSync } from 'bcryptjs';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super({
      usernameField: 'username',
      passportField: 'password',
    } as IStrategyOptions);
  }

  async validate(username: string, password: string): Promise<User> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password') // user 实体 exclude 掉了 password 字段
      .where('user.username=:username', { username })
      .getOne();
    if (!user) {
      throw new BadRequestException('用户名不正确！');
    }
    if (!compareSync(password, user.password)) {
      throw new BadRequestException('密码错误！');
    }
    return user;
  }
}
