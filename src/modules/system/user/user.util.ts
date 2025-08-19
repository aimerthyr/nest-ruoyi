import { SysDept } from '@prisma/client';

type DeptChildren = SysDept & { children: DeptChildren[] };

export function buildDeptTree(deptList: DeptChildren[]) {
  const deptMap = new Map<bigint, DeptChildren>([]);
  deptList.forEach(v => {
    v.children = [];
    deptMap.set(v.dept_id, v);
  });

  const result: DeptChildren[] = [];
  deptList.forEach(cur => {
    if (cur.parent_id !== BigInt(0)) {
      const parent = deptMap.get(cur.parent_id);
      if (parent) {
        parent.children.push(cur);
      }
    } else {
      result.push(cur);
    }
  });

  const createDeptItem = (dept: DeptChildren) => {
    return {
      id: dept.dept_id,
      label: dept.dept_name,
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
