import { AuthGuard } from '@nestjs/passport';
import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class JwtAuthModule extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    return request;
  }

  hanldeRequest<User>(err, user: User): User {
    if (err || !user) {
      throw new UnauthorizedException('身份验证失败');
    }
    return user;
  }
}
