import { DatabaseService } from '@common/database';
import { RequireAllPermission } from '@decorators';
import { Injectable } from '@nestjs/common';
import { buildDeptTree } from './user.util';

@Injectable()
export class UserService {
  constructor(private readonly _databaseService: DatabaseService) {}

  private async _queryDeptTree() {
    const dept = await this._databaseService.sysDept.findMany({
      where: {
        delFlag: '0',
      },
    });
    return dept;
  }

  @RequireAllPermission('system:user:list')
  async getDeptTree() {
    const deptList = await this._queryDeptTree();
    const deptTree = buildDeptTree(deptList as any);
    return deptTree;
  }
}
