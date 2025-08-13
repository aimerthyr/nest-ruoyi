import { SetMetadata } from '@nestjs/common';

/** 用于设置不需要登录就能访问 */
export const Public = () => SetMetadata('isPublic', true);
