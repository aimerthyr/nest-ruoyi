import { AjaxResultUtil } from '@/utils';
import { DatabaseService } from '@common/database';
import { DataScopeFilter, PageQueryDTO } from '@common/types';
import { Injectable } from '@nestjs/common';
import { buildDeptTree } from './user.util';

@Injectable()
export class UserService {
  constructor(private readonly _databaseService: DatabaseService) {}

  private async _queryDeptTree(dataScopeFilter: DataScopeFilter) {
    const dept = await this._databaseService.sysDept.findMany({
      where: {
        delFlag: '0',
        ...dataScopeFilter,
      },
    });
    return dept;
  }

  async getDeptTree(dataScopeFilter: DataScopeFilter) {
    const deptList = await this._queryDeptTree(dataScopeFilter);
    const deptTree = buildDeptTree(deptList as any);
    return AjaxResultUtil.success(deptTree);
  }

  async getUserList(query: PageQueryDTO, dataScopeFilter: DataScopeFilter) {
    const { pageNum, pageSize } = query;
    const users = await this._databaseService.sysUser.findMany({
      skip: (pageNum - 1) * pageSize,
      take: pageSize,
      where: dataScopeFilter,
      omit: {
        password: true,
      },
    });
    const depts = await this._databaseService.sysDept.findMany({
      where: {
        deptId: {
          in: users.filter(v => Boolean(v.deptId)).map(v => v.deptId!),
        },
      },
    });
    const deptMap = new Map(depts.map(v => [v.deptId.toString(), v]));
    users.forEach(v => {
      (v as any).dept = deptMap.get(v.deptId?.toString() || '') || null;
    });
    const total = await this._databaseService.sysUser.count({ where: dataScopeFilter });
    return AjaxResultUtil.page(users, total);
  }
}
