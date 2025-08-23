import { DATA_SCOPE_KEY } from '@constants/index';
import { SetMetadata } from '@nestjs/common';

/** 数据权限装饰器 （会自动在 request 上绑定数据权限 dataScopeFilter） */
export const DataScope = () => SetMetadata(DATA_SCOPE_KEY, true);
