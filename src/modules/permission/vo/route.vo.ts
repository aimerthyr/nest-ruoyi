// 菜单 Meta 信息
interface MenuMeta {
  title: string;
  icon: string;
  noCache: boolean;
  link: string | null;
}

// 菜单项类型
export interface MenuItem {
  name: string; // 菜单名称
  path: string; // 路径或外链
  hidden: boolean; // 是否隐藏
  component: string; // 组件路径
  redirect?: string; // 可选重定向
  alwaysShow?: boolean; // 可选，是否总是显示
  meta: MenuMeta; // 菜单 meta 信息
  children?: MenuItem[]; // 可选子菜单
}
