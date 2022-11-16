import {
  Controller,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  Post,
  Body,
  Req,
  Get,
  Res,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Headers } from '@nestjs/common';
import * as urlencode from 'urlencode';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { WechatLoginDto } from './dto/wechat-login.dto';

@ApiTags('验证')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: '密码登录' })
  @UseGuards(AuthGuard('local'))
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('login')
  async login(@Body() user: LoginDto, @Req() req) {
    return await this.authService.login(req.user);
  }

  @ApiOperation({ summary: '微信登录跳转' })
  @Get('wechatLogin')
  async wechatLogin(@Headers() header, @Res() res) {
    const APPID = process.env.APPID;
    const redirectUri = urlencode('https://developer.mozilla.org/');
    res.redirect(
      `https://open.weixin.qq.com/connect/qrconnect?appid=${APPID}&redirect_uri=${redirectUri}&response_type=code&scope=snsapi_login&state=STATE#wechat_redirect`,
    );
  }

  @ApiOperation({ summary: '微信登录' })
  @ApiBody({ type: WechatLoginDto, required: true })
  @Post('wechat')
  async loginWithWechat(@Body('code') code: string) {
    return this.authService.loginWithWechat(code);
  }
}
