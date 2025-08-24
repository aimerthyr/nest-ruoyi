import { SetMetadata } from '@nestjs/common';

export const DATA_SCOPE_KEY = 'has_data_scope';

/** 查询方式（由于部门表里没有用户 id ，所以 queryType 是 dept 的时候，会把仅本人改成仅本人部门）
 * user: 只针对用户进行查询（用户的部门 id 以及 用户 id）
 * dept: 只针对部门进行查询 (部门 id)
 */
export type DataScopeQueryType = 'user' | 'dept';

/** 数据权限装饰器 （会自动在 request 上绑定数据权限 dataScopeFilter） */
export const DataScope = (queryType: DataScopeQueryType) => SetMetadata(DATA_SCOPE_KEY, queryType);
