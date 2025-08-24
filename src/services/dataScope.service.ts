import { isSuperAdmin } from '@/utils';
import { DatabaseService } from '@common/database';
import { DataScopeQueryType } from '@decorators';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

type DataScopeFilter = Prisma.SysDeptWhereInput & Prisma.SysUserWhereInput;

@Injectable()
export class DataScopeService {
  constructor(private readonly _databaseService: DatabaseService) {}

  /**
   * 获取数据权限过滤条件（如果是查部门的话，那么仅本人这个数据范围，就需要修改为本部门）
   * // TODO: queryType 还需要支持角色
   * @param user 用户信息
   * @param queryType 查询类型：'user' | 'dept'，默认为 'user'
   */
  async getDataScopeFilter(user: User, queryType: DataScopeQueryType): Promise<DataScopeFilter> {
    if (isSuperAdmin(user.roleKeys)) {
      return {};
    }
    return await this._buildCondition(user, queryType);
  }

  /** 构建仅本人的筛选条件（不同查询方式，对应着不同条件） */
  private _createSelfCondition(user: User, queryType: DataScopeQueryType) {
    if (queryType === 'dept') {
      // 部门查询：返回用户所属部门（如果有的话）
      return user.deptId ? { deptId: { equals: user.deptId } } : { deptId: { equals: -1 } };
    } else {
      // 用户查询：返回仅本人
      return { userId: { equals: user.userId } };
    }
  }

  private async _buildCondition(
    user: User,
    queryType: DataScopeQueryType = 'user',
  ): Promise<DataScopeFilter> {
    // 构建 OR 条件（若依中需要取多个角色的并集）
    const orConditions: Partial<DataScopeFilter>[] = [];

    // 如果用户没有角色，返回仅本人数据权限
    if (!user.roleKeys || user.roleKeys.length === 0) {
      return this._createSelfCondition(user, queryType);
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
                Array<{ dept_id: bigint }>
              >`SELECT * FROM sys_dept WHERE FIND_IN_SET(${user.deptId.toString()}, ancestors) > 0`;
              orConditions.push({
                deptId: { in: [...data.map(v => v.dept_id), user.deptId] },
              });
            }
            break;
          }
          // 5. 仅本人
          case '5': {
            const defaultCondition = this._createSelfCondition(user, queryType);
            orConditions.push(defaultCondition);
            break;
          }
        }
      } catch (error) {
        console.error(`获取角色 ${role.roleKey} 的数据权限时出错:`, error);
        // 为当前出错的角色添加默认条件
        const defaultCondition = this._createSelfCondition(user, queryType);
        orConditions.push(defaultCondition);
      }
    }

    if (orConditions.length) {
      return { OR: orConditions };
    } else {
      return this._createSelfCondition(user, queryType);
    }
  }
}
