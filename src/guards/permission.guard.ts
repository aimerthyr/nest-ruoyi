import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { PERMISSIONS_KEY, PermissionValue } from '../decorators/require-permissions.decorator';
import { PermissionService } from '../modules/permission/permission.service';

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
    const request = context.switchToHttp().getRequest<Request>();
    const userPermissions = request.user.permissions;
    // 如果是超级管理员，则直接允许
    if (request.user.roleKeys.includes('admin')) return true;
    let hasPermission = false;
    const { permissions, mode } = permissionMeta;
    switch (mode) {
      case 'any':
        hasPermission = await this.permissionService.hasAnyPermission(userPermissions, permissions);
        break;
      case 'all':
        hasPermission = await this.permissionService.hasAllPermissions(
          userPermissions,
          permissions,
        );
        break;
    }
    if (!hasPermission) {
      throw new UnauthorizedException('权限不足');
    }
    return true;
  }
}
