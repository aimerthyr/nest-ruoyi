import { Prisma } from '@prisma/client';

export type DataScopeFilter = Prisma.SysDeptWhereInput & Prisma.SysUserWhereInput;
