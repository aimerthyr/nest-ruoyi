/** 转换 bigint */
export function bigintReplacer(_key: string, value: any) {
  return typeof value === 'bigint' ? value.toString() : value;
}

/** 判断是否为超级管理员 */
export function isSuperAdmin(roleKeys: string[]): boolean {
  return roleKeys.includes('admin');
}
