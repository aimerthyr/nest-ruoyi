import { SetMetadata } from '@nestjs/common';

export const PUBLIC_KEY = 'isPublic';

/** 用于设置不需要登录就能访问 */
export const Public = () => SetMetadata(PUBLIC_KEY, true);
