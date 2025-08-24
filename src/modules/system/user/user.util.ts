import { SysDept } from '@prisma/client';

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
