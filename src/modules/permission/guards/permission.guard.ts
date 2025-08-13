import { PERMISSIONS_KEY, PermissionValue } from '@decorators';
import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionService } from '../permission.service';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private permissionService: PermissionService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const permissionMeta = this.reflector.getAllAndOverride<PermissionValue>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // 没有权限要求，直接通过
    if (!permissionMeta) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('用户未登录');
    }

    const userId = BigInt(user.sub);

    // 处理不同的权限检查模式
    let hasPermission = false;

    const { permissions, mode } = permissionMeta;

    switch (mode) {
      case 'any':
        hasPermission = await this.permissionService.hasAnyPermission(userId, permissions);
        break;
      case 'all':
        hasPermission = await this.permissionService.hasAllPermissions(userId, permissions);
        break;
    }

    if (!hasPermission) {
      throw new ForbiddenException('权限不足');
    }

    return true;
  }
}
