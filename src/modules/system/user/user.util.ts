import { SysDept, SysUser } from '@prisma/client';
import * as XLSX from 'xlsx';

type DeptChildren = SysDept & { children: DeptChildren[] };

export function buildDeptTree(deptList: DeptChildren[]) {
  const deptMap = new Map<number, DeptChildren>([]);
  deptList.forEach(v => {
    v.children = [];
    deptMap.set(v.deptId, v);
  });

  const result: DeptChildren[] = [];
  deptList.forEach(cur => {
    if (cur.parentId !== 0) {
      const parent = deptMap.get(cur.parentId);
      if (parent) {
        parent.children.push(cur);
      } else {
        result.push(cur);
      }
    } else {
      result.push(cur);
    }
  });

  const createDeptItem = (dept: DeptChildren) => {
    return {
      id: dept.deptId,
      label: dept.deptName,
      disabled: dept.status === '1',
      children: dept.children?.length ? dept.children.map(createDeptItem) : undefined,
    };
  };

  const build = (list: DeptChildren[]) => {
    return list.map(v => ({
      ...createDeptItem(v),
      children: v.children?.length ? build(v.children) : undefined,
    }));
  };

  return build(result);
}

export function buildExcelData(users: SysUser[]) {
  // TODO: 单元格具体格式，可以精确
  const aoa: any[][] = [
    [
      '用户序号',
      '登录名称',
      '用户名称',
      '用户邮箱',
      '手机号码',
      '用户性别',
      '账号状态',
      '最后登录IP',
      '最后登录时间',
    ],
    ...users.map(v => [
      v.userId,
      v.userName,
      v.nickName,
      v.email,
      v.phonenumber,
      v.sex === '0' ? '男' : '女',
      v.status === '0' ? '正常' : '禁用',
      v.loginIp,
      v.loginDate,
    ]),
  ];
  const worksheet = XLSX.utils.aoa_to_sheet(aoa);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  return buffer;
}
