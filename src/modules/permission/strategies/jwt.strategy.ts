import { DatabaseService } from '@common/database';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { omit } from 'es-toolkit';
import { ExtractJwt, Strategy } from 'passport-jwt';

/**
 * 后续通过在 controller 的方法上使用 @UseGuards(AuthGuard('jwt'))
 * 即可判断是否允许授权（即登录验证通过）
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly _databaseService: DatabaseService) {
    /** 这里是告诉 passport 中间件 如何解析 token 以及验证 */
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  /** 验证通过后 passport 会自动调用 validate 并把 token 解析为签名前的 payload  */
  async validate(payload: { sub: bigint }) {
    const user = await this._databaseService.sysUser.findUnique({
      where: {
        user_id: payload.sub,
      },
    });
    if (!user) {
      throw new UnauthorizedException('认证失败，无法访问系统资源');
    }
    // 这里的返回值，会自动绑定到 req.user 上 （剔除掉敏感信息）
    return omit(user, ['password']);
  }
}
