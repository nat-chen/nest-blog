import { WechatUserInfo } from './../auth/auth.interface';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { compareSync } from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // 用户密码注册
  async register(createUser: CreateUserDto) {
    const { username } = createUser;
    const existUser = await this.userRepository.findOne({
      where: { username },
    });
    if (existUser) {
      throw new HttpException('用户名已存在', HttpStatus.BAD_REQUEST);
    }
    const newUser = await this.userRepository.create(createUser);
    return await this.userRepository.save(newUser);
  }

  // 微信注册
  async registerByWechat(userInfo: WechatUserInfo) {
    const { nickname, openid, headimgurl } = userInfo;
    const newUser = await this.userRepository.create({
      nickname,
      openid,
      avatar: headimgurl,
    });
    return await this.userRepository.save(newUser);
  }

  async findOne(id: string) {
    return await this.userRepository.findOneBy({ id });
  }

  async findByOpenid(openid: string) {
    return await this.userRepository.findOne({ where: { openid } });
  }

  comparePassword(password, libPassword) {
    return compareSync(password, libPassword);
  }
}
