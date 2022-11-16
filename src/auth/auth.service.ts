import { UserService } from './../user/user.service';
import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { HttpService } from '@nestjs/axios';
import {
  AccessTokenInfo,
  WechatError,
  WechatUserInfo,
  AccessConfig,
} from './auth.interface';
import { lastValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';

@Injectable()
export class AuthService {
  private accessTokenInfo: AccessTokenInfo;
  public apiServer = 'https://api.weixin.qq.com';

  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private httpService: HttpService,
  ) {}

  // 生成 token
  createToken(user: Partial<User>) {
    return this.jwtService.sign(user);
  }

  async login(user: Partial<User>) {
    const token = this.createToken({
      id: user.id,
      username: user.username,
      role: user.role,
    });
    return { token };
  }

  async loginWithWechat(code) {
    if (!code) {
      throw new BadRequestException('请输入微信授权码');
    }
    await this.getAccessToken(code);

    const user = await this.getUserByOpenId();
    if (!user) {
      // 获取用户信息，注册新用户
      const userInfo: WechatUserInfo = await this.getUserInfo();
      return this.userService.registerByWechat(userInfo);
    }
    return this.login(user);
  }

  async getUser(user) {
    return await this.userService.findOne(user.id);
  }

  async getUserByOpenId() {
    return await this.userService.findByOpenid(this.accessTokenInfo.openid);
  }

  async getUserInfo() {
    const result: AxiosResponse<WechatError & WechatUserInfo> =
      await lastValueFrom(
        this.httpService.get(
          `${this.apiServer}/sns/userinfo?access_token=${this.accessTokenInfo.accessToken}&openid=${this.accessTokenInfo.openid}`,
        ),
      );
    if (result.data.errcode) {
      throw new BadRequestException(
        `[getUserInfo] errcode:${result.data.errcode}, errmsg:${result.data.errmsg}`,
      );
    }
    console.log('result', result.data);

    return result.data;
  }

  async getAccessToken(code) {
    const { APPID, APPSECRET } = process.env;
    if (!APPSECRET) {
      throw new BadRequestException('[getAccessToken]必须有appSecret');
    }
    if (
      !this.accessTokenInfo ||
      (this.accessTokenInfo && this.isExpires(this.accessTokenInfo))
    ) {
      // 请求 accessToken 数据
      const res: AxiosResponse<WechatError & AccessConfig, any> =
        await lastValueFrom(
          this.httpService.get(
            `${this.apiServer}/sns/oauth2/access_token?appid=${APPID}&secret=${APPSECRET}&code=${code}&grant_type=authorization_code`,
          ),
        );
      if (res.data.errcode) {
        throw new BadRequestException(
          `[getAccessToken] errcode:${res.data.errcode}, errmsg:${res.data.errmsg}`,
        );
      }
      this.accessTokenInfo = {
        accessToken: res.data.access_token,
        expiresIn: res.data.expires_in,
        getTime: Date.now(),
        openid: res.data.openid,
      };
    }
    return this.accessTokenInfo.accessToken;
  }
  isExpires(access) {
    return Date.now() - access.getTime > access.expiresIn * 1000;
  }
}
