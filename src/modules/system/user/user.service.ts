import { AjaxResultUtil } from '@/utils';
import { DatabaseService } from '@common/database';
import { DataScopeFilter, PageQueryDTO } from '@common/types';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { UserQueryDTO } from './dto/userQuery.dto';
import { buildDeptTree, buildExcelData } from './user.util';

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

  async getUserList(query: UserQueryDTO, dataScopeFilter: DataScopeFilter) {
    const { pageNum, pageSize } = query;
    const where: Prisma.SysUserWhereInput = {
      ...dataScopeFilter,
      deptId: query.deptId,
      userName: { contains: query.userName },
      phonenumber: { contains: query.phonenumber },
      status: query.status,
      createTime: {
        gte: query['params[beginTime]'] ? new Date(query['params[beginTime]']) : undefined,
        lte: query['params[endTime]'] ? new Date(query['params[endTime]']) : undefined,
      },
    };
    const users = await this._databaseService.sysUser.findMany({
      skip: (pageNum - 1) * pageSize,
      take: pageSize,
      where,
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
    const total = await this._databaseService.sysUser.count({ where });
    return AjaxResultUtil.page(users, total);
  }

  async exportFile(query: PageQueryDTO, dataScopeFilter: DataScopeFilter) {
    const { pageNum, pageSize } = query;
    const users = await this._databaseService.sysUser.findMany({
      skip: (pageNum - 1) * pageSize,
      take: pageSize,
      where: dataScopeFilter,
    });
    return await buildExcelData(users);
  }
}
