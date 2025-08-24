import { SetMetadata } from '@nestjs/common';

export const PERMISSIONS_KEY = 'permissions_key';

export type PermissionValue = {
  permissions: string[];
  /** 模式 all => 全部都要满足 any=> 满足其中一个即可 */
  mode: 'all' | 'any';
};

/** 必须满足全部的权限点 */
export const RequireAllPermission = (...permissions: string[]) =>
  SetMetadata(PERMISSIONS_KEY, { permissions, mode: 'all' });

/** 满足其中一个权限点即可 */
export const RequireAnyPermission = (...permissions: string[]) =>
  SetMetadata(PERMISSIONS_KEY, { permissions, mode: 'any' });
