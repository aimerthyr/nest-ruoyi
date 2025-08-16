import { SysMenu } from '@prisma/client';
import { capitalize } from 'es-toolkit';
import { MenuItem } from './vo/route.vo';

type MenuChildren = SysMenu & { children?: MenuChildren[] };

/** 判断是否一级菜单内嵌跳转 */
function isMenuFrame(menu: SysMenu): boolean {
  return menu.parent_id === BigInt(0) && menu.menu_type === 'C' && menu.is_frame === 1;
}

/** 判断是否内部外网链接 */
function isInnerLink(menu: SysMenu): boolean {
  return menu.is_frame === 1 && menu.path.startsWith('http');
}

/** 判断是否父级视图菜单 */
function isParentView(menu: SysMenu): boolean {
  return menu.parent_id !== BigInt(0) && menu.menu_type === 'M';
}

/** 内链路径处理 */
function innerLinkReplaceEach(path: string): string {
  return path.replace(/^https?:\/\//, '/');
}

/** 获取组件名 */
function getComponent(menu: SysMenu): string {
  if (menu.component && !isMenuFrame(menu)) return menu.component;
  if (!menu.component && menu.parent_id !== BigInt(0) && isInnerLink(menu)) return 'InnerLink';
  if (!menu.component && isParentView(menu)) return 'ParentView';
  return 'Layout';
}

/** 获取路由路径，支持多级拼接 */
function getPath(menu: SysMenu): string {
  let routerPath = menu.path;

  // 内链处理
  if (menu.parent_id !== BigInt(0) && isInnerLink(menu)) {
    routerPath = innerLinkReplaceEach(routerPath);
  }

  // 一级目录
  if (menu.parent_id === BigInt(0) && menu.menu_type === 'M' && menu.is_frame === 1) {
    routerPath = `/${routerPath}`;
  } else if (isMenuFrame(menu)) {
    routerPath = '/';
  }
  return routerPath;
}

/** 构建前端路由 */
export function buildRouteTree(menuList: MenuChildren[]): MenuItem[] {
  const menuMap = new Map<bigint, MenuChildren>();
  const result: MenuChildren[] = [];

  // 做一个 map 然后每一项都设置 children
  menuList.forEach(menu => {
    if (!menu.path || menu.path === '#') return;
    menu.children = [];
    menuMap.set(menu.menu_id, menu);
  });

  // 构建树形结构
  menuList.forEach(menu => {
    if (!menu.path || menu.path === '#') return;
    if (menu.parent_id !== BigInt(0) && menuMap.has(menu.parent_id)) {
      menuMap.get(menu.parent_id)!.children!.push(menu);
    } else {
      result.push(menu);
    }
  });

  // 按 order_num 排序
  const sortMenus = (menus: MenuChildren[]) => {
    menus.sort((a, b) => a.order_num - b.order_num);
    menus.forEach(menu => menu.children && sortMenus(menu.children));
  };
  sortMenus(result);

  // 构建路由
  const buildRoutes = (menus: MenuChildren[]): MenuItem[] => {
    return menus.map(menu => {
      const route: MenuItem = {
        component: getComponent(menu),
        hidden: menu.visible === '1',
        meta: {
          title: menu.menu_name,
          icon: menu.icon,
          noCache: menu.is_cache === 1,
          link: isInnerLink(menu) ? menu.path : menu.is_frame === 0 ? menu.path : null,
        },
        name: capitalize(menu.path),
        path: getPath(menu),
      };

      if (menu.children && menu.children.length) {
        route.children = buildRoutes(menu.children);
        // 仅一级目录且有子路由才设置 alwaysShow
        if (menu.parent_id === BigInt(0)) route.alwaysShow = true;
      }

      return route;
    });
  };

  return buildRoutes(result);
}
