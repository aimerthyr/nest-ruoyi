import { isSuperAdmin } from '@/utils';
import { DatabaseService } from '@common/database';
import { Injectable } from '@nestjs/common';
import { Prisma, SysDept } from '@prisma/client';

type DataScopeFilter = Prisma.SysDeptWhereInput & Prisma.SysUserWhereInput;

@Injectable()
export class DataScopeService {
  constructor(private readonly _databaseService: DatabaseService) {}

  async getDataScopeFilter(user: User): Promise<DataScopeFilter> {
    if (isSuperAdmin(user.roleKeys)) {
      return {};
    }
    return await this._buildCondition(user);
  }

  private async _buildCondition(user: User): Promise<DataScopeFilter> {
    // 构建 OR 条件（若依中需要取多个角色的并集）
    const orConditions: Partial<DataScopeFilter>[] = [];
    for (let i = 0; i < user.roleKeys.length; i++) {
      const role = await this._databaseService.sysRole.findFirst({
        where: { role_key: user.roleKeys[i] },
      });
      if (!role) continue;
      switch (role.data_scope) {
        // 1. 全部数据范围
        case '1':
          return {};
        // 2. 自定义部门
        case '2': {
          const data = await this._databaseService.sysRoleDept.findMany({
            where: { role_id: role.role_id },
          });
          if (data.length) {
            orConditions.push({
              dept_id: { in: data.map(v => v.dept_id) },
            });
          }
          break;
        }
        // 3. 本部门
        case '3': {
          if (user.dept_id) {
            orConditions.push({
              dept_id: { equals: user.dept_id },
            });
          }
          break;
        }
        // 4. 本部门及以下
        case '4': {
          if (user.dept_id) {
            const data = await this._databaseService.$queryRaw<
              SysDept[]
            >`SELECT * FROM sys_dept WHERE FIND_IN_SET(${user.dept_id}, ancestors) > 0`;
            orConditions.push({
              dept_id: { in: [...data.map(v => v.dept_id), user.dept_id] },
            });
          }
          break;
        }
        // 5. 仅本人
        case '5': {
          orConditions.push({
            user_id: { equals: user.user_id },
          });
          break;
        }
      }
    }
    return orConditions.length ? { OR: orConditions } : {};
  }
}
