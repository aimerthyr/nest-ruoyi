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
    const total = await this._databaseService.sysUser.count({ where: dataScopeFilter });
    return AjaxResultUtil.page(users, total);
  }
}
