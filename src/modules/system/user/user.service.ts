import { AjaxResultUtil } from '@/utils';
import { DatabaseService } from '@common/database';
import { DataScopeFilter, PageQueryDTO } from '@common/types';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { hashSync } from 'bcrypt';
import { UserCreateDTO } from './dto/userCreate.dto';
import { UserQueryDTO } from './dto/userQuery.dto';
import { UserChangeStatusDTO, UserUpdateDTO } from './dto/userUpdate.dto';
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
      delFlag: '0',
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

  async getUserCreateConf(user: User) {
    const posts = await this._databaseService.sysPost.findMany({
      where: {
        status: '0',
      },
    });
    const roles = await this._databaseService.sysRole.findMany({
      where: {
        roleKey: { in: user.roleKeys },
        status: '0',
        delFlag: '0',
      },
    });
    return AjaxResultUtil.customSuccess({
      posts,
      roles,
    });
  }

  async createUser(createDTO: UserCreateDTO) {
    const { postIds, roleIds, ...userData } = createDTO;
    await this._databaseService.$transaction(async prisma => {
      await prisma.sysUser.create({
        data: {
          ...userData,
          password: hashSync(createDTO.password, 10),
          loginDate: new Date(),
          pwdUpdateDate: new Date(),
          posts: {
            create: postIds?.length ? postIds.map(id => ({ postId: id })) : [],
          },
          roles: {
            create: roleIds?.length ? roleIds.map(id => ({ roleId: id })) : [],
          },
        },
      });
    });
    return AjaxResultUtil.customSuccess({ msg: '操作成功' });
  }

  async getUserInfo(userId: number) {
    const data = await this._databaseService.sysUser.findUnique({
      where: { userId },
      include: {
        posts: {
          include: {
            post: {},
          },
        },
        roles: {
          include: {
            role: {},
          },
        },
      },
      omit: {
        password: true,
      },
    });
    const posts = await this._databaseService.sysPost.findMany({ where: { status: '0' } });
    const roles = await this._databaseService.sysRole.findMany({
      where: { status: '0', roleKey: { not: 'admin' } },
    });
    return AjaxResultUtil.customSuccess({
      data,
      postIds: data?.posts?.map(v => v.postId),
      posts,
      roleIds: data?.roles?.map(v => v.roleId),
      roles,
    });
  }

  async deleteUser(userId: number) {
    await this._databaseService.sysUser.update({
      where: { userId },
      data: {
        delFlag: '2',
      },
    });
    return AjaxResultUtil.customSuccess({ msg: '操作成功' });
  }

  async updateUser(updateDTO: UserUpdateDTO) {
    const { postIds, roleIds, ...userData } = updateDTO;
    await this._databaseService.$transaction(async tx => {
      await tx.sysUser.update({
        where: { userId: updateDTO.userId },
        data: {
          ...userData,
          posts: {
            set: postIds?.length
              ? postIds.map(postId => ({ userId_postId: { userId: updateDTO.userId, postId } }))
              : [],
          },
          roles: {
            set: roleIds?.length
              ? roleIds.map(roleId => ({ userId_roleId: { userId: updateDTO.userId, roleId } }))
              : [],
          },
        },
      });
    });
    return AjaxResultUtil.customSuccess({ msg: '操作成功' });
  }

  async changeStatus(changeStatusDTO: UserChangeStatusDTO) {
    await this._databaseService.sysUser.update({
      where: { userId: changeStatusDTO.userId },
      data: {
        status: changeStatusDTO.status,
      },
    });
    return AjaxResultUtil.customSuccess({ msg: '操作成功' });
  }
}
