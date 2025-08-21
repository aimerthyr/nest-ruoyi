import { isSuperAdmin } from '@/utils';
import { AjaxResultUtil } from '@/utils/ajaxResult.util';
import { DatabaseService } from '@common/database';
import { RedisService } from '@common/redis';
import { MIN_30 } from '@constants/date';
import { REDIS_CAPTCHA, REDIS_USER_PERMISSION } from '@constants/redis';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcrypt';
import { createMathExpr } from 'svg-captcha';
import { v4 as uuidv4 } from 'uuid';
import { LoginDTO } from './dto/login.dto';
import { buildRouteTree } from './permission.util';

@Injectable()
export class PermissionService {
  constructor(
    private readonly _redisService: RedisService,
    private readonly _databaseService: DatabaseService,
    private readonly _jwtService: JwtService,
  ) {}

  /** 创建算式验证码图片 */
  private _createCaptchaImage(): { uuid: string; img: string } {
    const { text, data } = createMathExpr({
      mathMax: 10,
      mathMin: 1,
    });
    const uuid = uuidv4();
    this._redisService.set(`${REDIS_CAPTCHA}:${uuid}`, text, 15 * 1000);
    return {
      img: Buffer.from(data).toString('base64'),
      uuid,
    };
  }

  /** 获取验证码 */
  async getCaptchaImage() {
    const { uuid, img } = this._createCaptchaImage();
    return AjaxResultUtil.customSuccess({
      img,
      uuid,
      captchaEnabled: true,
    });
  }

  private _generateToken(userId: bigint) {
    return this._jwtService.sign(
      {
        sub: userId.toString(),
      },
      {
        secret: process.env.JWT_SECRET,
      },
    );
  }

  async login(loginDto: LoginDTO) {
    // 获取验证码答案
    const answer = await this._redisService.get(`${REDIS_CAPTCHA}:${loginDto.uuid}`);
    if (answer !== loginDto.code) {
      throw AjaxResultUtil.error('验证码错误');
    }
    const user = await this._databaseService.sysUser.findFirst({
      where: {
        user_name: loginDto.username,
      },
    });
    if (!user) {
      throw AjaxResultUtil.error('用户不存在/密码错误');
    }
    const isPasswordValid = compareSync(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw AjaxResultUtil.error('用户不存在/密码错误');
    }
    const token = this._generateToken(user.user_id);
    return AjaxResultUtil.customSuccess({
      token,
    });
  }

  async getUserInfo(user: User) {
    const userInfo = await this._databaseService.sysUser.findUnique({
      where: {
        user_id: user.user_id,
      },
      omit: {
        password: true,
      },
      include: {
        roles: {
          include: {
            role: {},
          },
        },
      },
    });
    const deptInfo = await this._databaseService.sysDept.findUnique({
      where: {
        dept_id: userInfo!.dept_id!,
      },
    });
    return AjaxResultUtil.customSuccess({
      // TODO: 需要结合参数配置表中是否开启初始密码修改策略进行判断
      isDefaultModifyPwd: false,
      // TODO: 需要结合参数配置表中是否设置密码更新周期进行判断
      isPasswordExpired: false,
      permissions: isSuperAdmin(user.roleKeys) ? ['*:*:*'] : user.permissions,
      roles: user.roleKeys,
      user: {
        ...userInfo,
        roles: userInfo?.roles.map(v => v.role),
        dept: deptInfo,
      },
    });
  }

  async getRouters(roleKeys: string[]) {
    const list = await this._queryUserMenuList(roleKeys);
    return AjaxResultUtil.success(buildRouteTree(list));
  }

  /** 查询用户可以访问的菜单列表 */
  async _queryUserMenuList(roleKeys: string[]) {
    const roleIds = await this._databaseService.sysRole.findMany({
      where: {
        role_key: {
          in: roleKeys,
        },
      },
      select: {
        role_id: true,
      },
    });
    const menu = await this._databaseService.sysRoleMenu.findMany({
      where: isSuperAdmin(roleKeys)
        ? {}
        : {
            role_id: {
              in: roleIds.map(v => v.role_id),
            },
          },
      include: {
        menu: {},
      },
      distinct: ['menu_id'],
    });
    return menu.map(v => v.menu).filter(v => v.status === '0');
  }

  /** 判断用户是否具备所有的权限 */
  async hasAllPermissions(userPermissions: string[], permissions: string[]): Promise<boolean> {
    return permissions.every(permission => userPermissions.includes(permission));
  }

  /** 判断用户是否具备任意其中一个权限 */
  async hasAnyPermission(userPermissions: string[], permissions: string[]): Promise<boolean> {
    return permissions.some(permission => userPermissions.includes(permission));
  }

  /** 查询用户权限（数据库查询方法统一用 _query 做前缀） */
  private async _queryUserPermission(userId: bigint): Promise<string[]> {
    const result = await this._databaseService.sysUser.findUnique({
      where: { user_id: userId },
      include: {
        roles: {
          include: {
            role: {
              select: {
                /** 角色状态（需要启用） */
                status: true,
                /** 角色是否被删除 */
                del_flag: true,
                menus: {
                  include: {
                    menu: {
                      select: {
                        perms: true,
                        /** 菜单状态（需要启用） */
                        status: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
    if (!result) return [];
    // 多个角色需要将权限点进行合并并去重
    const permissions = new Set<string>();
    result.roles.forEach(userRole => {
      // 检查角色是否存在且状态正常
      if (userRole.role && userRole.role.status === '0' && userRole.role.del_flag === '0') {
        userRole.role.menus.forEach(roleMenu => {
          // 检查菜单权限标识是否存在且菜单状态正常
          if (
            roleMenu.menu &&
            roleMenu.menu.status === '0' && // 菜单状态正常
            roleMenu.menu.perms &&
            roleMenu.menu.perms.trim() !== ''
          ) {
            permissions.add(roleMenu.menu.perms);
          }
        });
      }
    });
    return Array.from(permissions);
  }

  /** 通过 userId 获取用户权限 */
  async getUserPermissions(userId: bigint): Promise<string[]> {
    const cacheKey = `${REDIS_USER_PERMISSION}:${userId}`;
    const cachedPermissions = await this._redisService.get(cacheKey);
    if (cachedPermissions) {
      return cachedPermissions;
    }
    // 缓存未命中，从数据库查询
    const permissions = await this._queryUserPermission(userId);
    // 缓存权限信息，设置30分钟过期
    await this._redisService.set(cacheKey, permissions, MIN_30);
    return permissions;
  }
}
