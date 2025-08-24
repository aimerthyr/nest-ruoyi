import { SysMenu } from '@prisma/client';
import { capitalize } from 'es-toolkit';
import { MenuItemVO } from './vo/route.vo';

type MenuChildren = SysMenu & { children?: MenuChildren[] };

/** 判断是否一级菜单内嵌跳转 */
function isMenuFrame(menu: SysMenu): boolean {
  return menu.parentId === 0 && menu.menuType === 'C' && menu.isFrame === 1;
}

/** 判断是否内部外网链接 */
function isInnerLink(menu: SysMenu): boolean {
  return menu.isFrame === 1 && menu.path.startsWith('http');
}

/** 判断是否父级视图菜单 */
function isParentView(menu: SysMenu): boolean {
  return menu.parentId !== 0 && menu.menuType === 'M';
}

/** 内链路径处理 */
function innerLinkReplaceEach(path: string): string {
  return path.replace(/^https?:\/\//, '/');
}

/** 获取组件名 */
function getComponent(menu: SysMenu): string {
  if (menu.component && !isMenuFrame(menu)) return menu.component;
  if (!menu.component && menu.parentId !== 0 && isInnerLink(menu)) return 'InnerLink';
  if (!menu.component && isParentView(menu)) return 'ParentView';
  return 'Layout';
}

/** 获取路由路径，支持多级拼接 */
function getPath(menu: SysMenu): string {
  let routerPath = menu.path;

  // 内链处理
  if (menu.parentId !== 0 && isInnerLink(menu)) {
    routerPath = innerLinkReplaceEach(routerPath);
  }

  // 一级目录
  if (menu.parentId === 0 && menu.menuType === 'M' && menu.isFrame === 1) {
    routerPath = `/${routerPath}`;
  } else if (isMenuFrame(menu)) {
    routerPath = '/';
  }
  return routerPath;
}

/** 构建前端路由 */
export function buildRouteTree(menuList: MenuChildren[]): MenuItemVO[] {
  const menuMap = new Map<number, MenuChildren>();
  const result: MenuChildren[] = [];

  // 做一个 map 然后每一项都设置 children
  menuList.forEach(menu => {
    if (!menu.path || menu.path === '#') return;
    menu.children = [];
    menuMap.set(menu.menuId, menu);
  });

  // 构建树形结构
  menuList.forEach(menu => {
    if (!menu.path || menu.path === '#') return;
    if (menu.parentId !== 0 && menuMap.has(menu.parentId)) {
      menuMap.get(menu.parentId)!.children!.push(menu);
    } else {
      result.push(menu);
    }
  });

  // 按 order_num 排序
  const sortMenus = (menus: MenuChildren[]) => {
    menus.sort((a, b) => a.orderNum - b.orderNum);
    menus.forEach(menu => menu.children && sortMenus(menu.children));
  };
  sortMenus(result);

  // 构建路由
  const buildRoutes = (menus: MenuChildren[]): MenuItemVO[] => {
    return menus.map(menu => {
      const route: MenuItemVO = {
        component: getComponent(menu),
        hidden: menu.visible === '1',
        meta: {
          title: menu.menuName,
          icon: menu.icon,
          noCache: menu.isCache === 1,
          link: isInnerLink(menu) ? menu.path : menu.isFrame === 0 ? menu.path : null,
        },
        name: capitalize(menu.path),
        path: getPath(menu),
      };

      if (menu.children && menu.children.length) {
        route.children = buildRoutes(menu.children);
        // 仅一级目录且有子路由才设置 alwaysShow
        if (menu.parentId === 0) route.alwaysShow = true;
      }

      return route;
    });
  };

  return buildRoutes(result);
}
