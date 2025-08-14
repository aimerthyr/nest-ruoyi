import { MIN_30, REDIS_USER_INFO } from '@/constants';
import { DatabaseService } from '@common/database';
import { RedisService } from '@common/redis';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { omit } from 'es-toolkit';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PermissionService } from '../permission.service';

/**
 * 后续通过在 controller 的方法上使用 @UseGuards(JwtAuthGuard('jwt'))
 * 即可判断是否允许授权（即登录验证通过）
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly _databaseService: DatabaseService,
    private readonly _permissionService: PermissionService,
    private readonly _redisService: RedisService,
  ) {
    /** 这里是告诉 passport 中间件 如何解析 token 以及验证 */
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  /** 验证通过后 passport 会自动调用 validate 并把 token 解析为签名前的 payload  */
  async validate(payload: { sub: bigint }): Promise<Request['user']> {
    const cacheKey = `${REDIS_USER_INFO}:${payload.sub.toString()}`;
    const cacheUser = await this._redisService.get<Request['user']>(cacheKey);
    if (cacheUser) {
      return cacheUser;
    }
    const user = await this._databaseService.sysUser.findUnique({
      where: {
        user_id: payload.sub,
        status: '0', // 只允许正常状态的用户
        del_flag: '0', // 只允许未删除的用户
      },
      include: {
        roles: {
          include: {
            role: {
              select: {
                role_key: true,
                status: true,
                del_flag: true,
              },
            },
          },
        },
      },
    });
    if (!user) {
      throw new UnauthorizedException('无效的会话，或者会话已过期，请重新登录。');
    }
    const permission = await this._permissionService.getUserPermissions(user.user_id);
    const userInfo: Request['user'] = {
      ...omit(user, ['password']),
      roleKeys: user.roles
        .filter(v => v.role.status === '0' && v.role.del_flag === '0')
        .map(role => role.role.role_key),
      permissions: permission,
    };
    await this._redisService.set(cacheKey, userInfo, MIN_30);
    // 这里的返回值，会自动绑定到 req.user 上 （剔除掉敏感信息）
    return userInfo;
  }
}
