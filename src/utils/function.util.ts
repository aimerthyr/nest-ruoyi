/** 转换 bigint */
export function bigintReplacer(_key: string, value: any) {
  // 正确方式是调用 toString()，防止丢失精度，但这里为了保持和若依一直方便，直接转换为 Number
  return typeof value === 'bigint' ? Number(value) : value;
}

/** 判断是否为超级管理员 */
export function isSuperAdmin(roleKeys: string[]): boolean {
  return roleKeys.includes('admin');
}
