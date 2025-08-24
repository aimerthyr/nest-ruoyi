/** 判断是否为超级管理员 */
export function isSuperAdmin(roleKeys: string[]): boolean {
  return roleKeys.includes('admin');
}
