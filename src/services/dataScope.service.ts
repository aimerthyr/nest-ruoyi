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

    // 如果用户没有角色，返回仅本人数据权限
    if (!user.roleKeys || user.roleKeys.length === 0) {
      return { userId: { equals: user.userId } };
    }
    const roles = await this._databaseService.sysRole.findMany({
      where: { roleKey: { in: user.roleKeys } },
    });

    for (const role of roles) {
      try {
        if (!role || !role.dataScope) continue;

        switch (role.dataScope) {
          // 1. 全部数据范围
          case '1':
            return {};
          // 2. 自定义部门
          case '2': {
            const data = await this._databaseService.sysRoleDept.findMany({
              where: { roleId: role.roleId },
            });
            if (data.length) {
              orConditions.push({
                deptId: { in: data.map(v => v.deptId) },
              });
            }
            break;
          }
          // 3. 本部门
          case '3': {
            if (user.deptId) {
              orConditions.push({
                deptId: { equals: user.deptId },
              });
            }
            break;
          }
          // 4. 本部门及以下
          case '4': {
            if (user.deptId) {
              // 使用参数化查询防止SQL注入
              const data = await this._databaseService.$queryRaw<
                SysDept[]
              >`SELECT * FROM sys_dept WHERE FIND_IN_SET(${Prisma.raw(user.deptId.toString())}, ancestors) > 0`;
              orConditions.push({
                deptId: { in: [...data.map(v => v.deptId), user.deptId] },
              });
            }
            break;
          }
          // 5. 仅本人
          case '5': {
            orConditions.push({
              userId: { equals: user.userId },
            });
            break;
          }
          default:
            // 未知的数据权限范围，默认仅本人
            orConditions.push({
              userId: { equals: user.userId },
            });
            break;
        }
      } catch (error) {
        console.error(`获取角色 ${role.roleKey} 的数据权限时出错:`, error);
        // 出错时默认仅本人数据权限
        orConditions.push({
          userId: { equals: user.userId },
        });
      }
    }

    // 如果没有任何有效的权限条件，默认仅本人
    return orConditions.length ? { OR: orConditions } : { userId: { equals: user.userId } };
  }
}
