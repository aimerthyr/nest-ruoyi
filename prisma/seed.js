const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/** 初始化数据库中的数据（没必要使用.ts） */
async function main() {
  console.log('开始初始化数据库...');
  // 初始化-用户信息表数据
  await prisma.$executeRawUnsafe(`
    INSERT INTO sys_user VALUES
      (1,  103, 'admin', '若依', '00', 'ry@163.com', '15888888888', '1', '', '$2b$10$eTbfgPcgS.Zv69pKnrccIOiIkK3vxbMMWnK7LLFps4gu9wAmwQroO', '0', '0', '127.0.0.1', sysdate(), sysdate(), 'admin', sysdate(), '', sysdate(), '管理员'),
      (2,  105, 'ry',    '若依', '00', 'ry@qq.com',  '15666666666', '1', '', '$2b$10$eTbfgPcgS.Zv69pKnrccIOiIkK3vxbMMWnK7LLFps4gu9wAmwQroO', '0', '0', '127.0.0.1', sysdate(), sysdate(), 'admin', sysdate(), '', sysdate(), '测试员');
  `);
  // 初始化-角色信息表数据
  await prisma.$executeRawUnsafe(`
    INSERT INTO sys_role VALUES
      ('1', '超级管理员',  'admin',  1, 1, 1, 1, '0', '0', 'admin', sysdate(), '', null, '超级管理员'),
      ('2', '普通角色',    'common', 2, 2, 1, 1, '0', '0', 'admin', sysdate(), '', null, '普通角色');
  `);
  // 初始化-用户角色关联表数据
  await prisma.$executeRawUnsafe(`
    INSERT INTO sys_user_role VALUES
      ('1', '1'),
      ('2', '2');
  `);
  // 初始化-菜单信息表数据
  await prisma.$executeRawUnsafe(`
    INSERT INTO sys_menu VALUES
      ('1', '系统管理', '0', '1', 'system', null, '', '', 1, 0, 'M', '0', '0', '', 'system', 'admin', sysdate(), '', null, '系统管理目录'),
      ('2', '系统监控', '0', '2', 'monitor', null, '', '', 1, 0, 'M', '0', '0', '', 'monitor', 'admin', sysdate(), '', null, '系统监控目录'),
      ('3', '系统工具', '0', '3', 'tool', null, '', '', 1, 0, 'M', '0', '0', '', 'tool', 'admin', sysdate(), '', null, '系统工具目录'),
      ('4', '若依官网', '0', '4', 'http://ruoyi.vip', null, '', '', 0, 0, 'M', '0', '0', '', 'guide', 'admin', sysdate(), '', null, '若依官网地址'),
      ('100', '用户管理', '1', '1', 'user', 'system/user/index', '', '', 1, 0, 'C', '0', '0', 'system:user:list', 'user', 'admin', sysdate(), '', null, '用户管理菜单'),
      ('101', '角色管理', '1', '2', 'role', 'system/role/index', '', '', 1, 0, 'C', '0', '0', 'system:role:list', 'peoples', 'admin', sysdate(), '', null, '角色管理菜单'),
      ('102', '菜单管理', '1', '3', 'menu', 'system/menu/index', '', '', 1, 0, 'C', '0', '0', 'system:menu:list', 'tree-table', 'admin', sysdate(), '', null, '菜单管理菜单'),
      ('103', '部门管理', '1', '4', 'dept', 'system/dept/index', '', '', 1, 0, 'C', '0', '0', 'system:dept:list', 'tree', 'admin', sysdate(), '', null, '部门管理菜单'),
      ('104', '岗位管理', '1', '5', 'post', 'system/post/index', '', '', 1, 0, 'C', '0', '0', 'system:post:list', 'post', 'admin', sysdate(), '', null, '岗位管理菜单'),
      ('105', '字典管理', '1', '6', 'dict', 'system/dict/index', '', '', 1, 0, 'C', '0', '0', 'system:dict:list', 'dict', 'admin', sysdate(), '', null, '字典管理菜单'),
      ('106', '参数设置', '1', '7', 'config', 'system/config/index', '', '', 1, 0, 'C', '0', '0', 'system:config:list', 'edit', 'admin', sysdate(), '', null, '参数设置菜单'),
      ('107', '通知公告', '1', '8', 'notice', 'system/notice/index', '', '', 1, 0, 'C', '0', '0', 'system:notice:list', 'message', 'admin', sysdate(), '', null, '通知公告菜单'),
      ('108', '日志管理', '1', '9', 'log', '', '', '', 1, 0, 'M', '0', '0', '', 'log', 'admin', sysdate(), '', null, '日志管理菜单'),
      ('109', '在线用户', '2', '1', 'online', 'monitor/online/index', '', '', 1, 0, 'C', '0', '0', 'monitor:online:list', 'online', 'admin', sysdate(), '', null, '在线用户菜单'),
      ('110', '定时任务', '2', '2', 'job', 'monitor/job/index', '', '', 1, 0, 'C', '0', '0', 'monitor:job:list', 'job', 'admin', sysdate(), '', null, '定时任务菜单'),
      ('111', '数据监控', '2', '3', 'druid', 'monitor/druid/index', '', '', 1, 0, 'C', '0', '0', 'monitor:druid:list', 'druid', 'admin', sysdate(), '', null, '数据监控菜单'),
      ('112', '服务监控', '2', '4', 'server', 'monitor/server/index', '', '', 1, 0, 'C', '0', '0', 'monitor:server:list', 'server', 'admin', sysdate(), '', null, '服务监控菜单'),
      ('113', '缓存监控', '2', '5', 'cache', 'monitor/cache/index', '', '', 1, 0, 'C', '0', '0', 'monitor:cache:list', 'redis', 'admin', sysdate(), '', null, '缓存监控菜单'),
      ('114', '缓存列表', '2', '6', 'cacheList', 'monitor/cache/list', '', '', 1, 0, 'C', '0', '0', 'monitor:cache:list', 'redis-list', 'admin', sysdate(), '', null, '缓存列表菜单'),
      ('115', '表单构建', '3', '1', 'build', 'tool/build/index', '', '', 1, 0, 'C', '0', '0', 'tool:build:list', 'build', 'admin', sysdate(), '', null, '表单构建菜单'),
      ('116', '代码生成', '3', '2', 'gen', 'tool/gen/index', '', '', 1, 0, 'C', '0', '0', 'tool:gen:list', 'code', 'admin', sysdate(), '', null, '代码生成菜单'),
      ('117', '系统接口', '3', '3', 'swagger', 'tool/swagger/index', '', '', 1, 0, 'C', '0', '0', 'tool:swagger:list', 'swagger', 'admin', sysdate(), '', null, '系统接口菜单'),
      ('500', '操作日志', '108', '1', 'operlog', 'monitor/operlog/index', '', '', 1, 0, 'C', '0', '0', 'monitor:operlog:list', 'form', 'admin', sysdate(), '', null, '操作日志菜单'),
      ('501', '登录日志', '108', '2', 'logininfor', 'monitor/logininfor/index', '', '', 1, 0, 'C', '0', '0', 'monitor:logininfor:list', 'logininfor', 'admin', sysdate(), '', null, '登录日志菜单'),
      ('1000', '用户查询', '100', '1', '', '', '', '', 1, 0, 'F', '0', '0', 'system:user:query', '#', 'admin', sysdate(), '', null, ''),
      ('1001', '用户新增', '100', '2', '', '', '', '', 1, 0, 'F', '0', '0', 'system:user:add', '#', 'admin', sysdate(), '', null, ''),
      ('1002', '用户修改', '100', '3', '', '', '', '', 1, 0, 'F', '0', '0', 'system:user:edit', '#', 'admin', sysdate(), '', null, ''),
      ('1003', '用户删除', '100', '4', '', '', '', '', 1, 0, 'F', '0', '0', 'system:user:remove', '#', 'admin', sysdate(), '', null, ''),
      ('1004', '用户导出', '100', '5', '', '', '', '', 1, 0, 'F', '0', '0', 'system:user:export', '#', 'admin', sysdate(), '', null, ''),
      ('1005', '用户导入', '100', '6', '', '', '', '', 1, 0, 'F', '0', '0', 'system:user:import', '#', 'admin', sysdate(), '', null, ''),
      ('1006', '重置密码', '100', '7', '', '', '', '', 1, 0, 'F', '0', '0', 'system:user:resetPwd', '#', 'admin', sysdate(), '', null, ''),
      ('1007', '角色查询', '101', '1', '', '', '', '', 1, 0, 'F', '0', '0', 'system:role:query', '#', 'admin', sysdate(), '', null, ''),
      ('1008', '角色新增', '101', '2', '', '', '', '', 1, 0, 'F', '0', '0', 'system:role:add', '#', 'admin', sysdate(), '', null, ''),
      ('1009', '角色修改', '101', '3', '', '', '', '', 1, 0, 'F', '0', '0', 'system:role:edit', '#', 'admin', sysdate(), '', null, ''),
      ('1010', '角色删除', '101', '4', '', '', '', '', 1, 0, 'F', '0', '0', 'system:role:remove', '#', 'admin', sysdate(), '', null, ''),
      ('1011', '角色导出', '101', '5', '', '', '', '', 1, 0, 'F', '0', '0', 'system:role:export', '#', 'admin', sysdate(), '', null, ''),
      ('1012', '菜单查询', '102', '1', '', '', '', '', 1, 0, 'F', '0', '0', 'system:menu:query', '#', 'admin', sysdate(), '', null, ''),
      ('1013', '菜单新增', '102', '2', '', '', '', '', 1, 0, 'F', '0', '0', 'system:menu:add', '#', 'admin', sysdate(), '', null, ''),
      ('1014', '菜单修改', '102', '3', '', '', '', '', 1, 0, 'F', '0', '0', 'system:menu:edit', '#', 'admin', sysdate(), '', null, ''),
      ('1015', '菜单删除', '102', '4', '', '', '', '', 1, 0, 'F', '0', '0', 'system:menu:remove', '#', 'admin', sysdate(), '', null, ''),
      ('1016', '部门查询', '103', '1', '', '', '', '', 1, 0, 'F', '0', '0', 'system:dept:query', '#', 'admin', sysdate(), '', null, ''),
      ('1017', '部门新增', '103', '2', '', '', '', '', 1, 0, 'F', '0', '0', 'system:dept:add', '#', 'admin', sysdate(), '', null, ''),
      ('1018', '部门修改', '103', '3', '', '', '', '', 1, 0, 'F', '0', '0', 'system:dept:edit', '#', 'admin', sysdate(), '', null, ''),
      ('1019', '部门删除', '103', '4', '', '', '', '', 1, 0, 'F', '0', '0', 'system:dept:remove', '#', 'admin', sysdate(), '', null, ''),
      ('1020', '岗位查询', '104', '1', '', '', '', '', 1, 0, 'F', '0', '0', 'system:post:query', '#', 'admin', sysdate(), '', null, ''),
      ('1021', '岗位新增', '104', '2', '', '', '', '', 1, 0, 'F', '0', '0', 'system:post:add', '#', 'admin', sysdate(), '', null, ''),
      ('1022', '岗位修改', '104', '3', '', '', '', '', 1, 0, 'F', '0', '0', 'system:post:edit', '#', 'admin', sysdate(), '', null, ''),
      ('1023', '岗位删除', '104', '4', '', '', '', '', 1, 0, 'F', '0', '0', 'system:post:remove', '#', 'admin', sysdate(), '', null, ''),
      ('1024', '岗位导出', '104', '5', '', '', '', '', 1, 0, 'F', '0', '0', 'system:post:export', '#', 'admin', sysdate(), '', null, ''),
      ('1025', '字典查询', '105', '1', '#', '', '', '', 1, 0, 'F', '0', '0', 'system:dict:query', '#', 'admin', sysdate(), '', null, ''),
      ('1026', '字典新增', '105', '2', '#', '', '', '', 1, 0, 'F', '0', '0', 'system:dict:add', '#', 'admin', sysdate(), '', null, ''),
      ('1027', '字典修改', '105', '3', '#', '', '', '', 1, 0, 'F', '0', '0', 'system:dict:edit', '#', 'admin', sysdate(), '', null, ''),
      ('1028', '字典删除', '105', '4', '#', '', '', '', 1, 0, 'F', '0', '0', 'system:dict:remove', '#', 'admin', sysdate(), '', null, ''),
      ('1029', '字典导出', '105', '5', '#', '', '', '', 1, 0, 'F', '0', '0', 'system:dict:export', '#', 'admin', sysdate(), '', null, ''),
      ('1030', '参数查询', '106', '1', '#', '', '', '', 1, 0, 'F', '0', '0', 'system:config:query', '#', 'admin', sysdate(), '', null, ''),
      ('1031', '参数新增', '106', '2', '#', '', '', '', 1, 0, 'F', '0', '0', 'system:config:add', '#', 'admin', sysdate(), '', null, ''),
      ('1032', '参数修改', '106', '3', '#', '', '', '', 1, 0, 'F', '0', '0', 'system:config:edit', '#', 'admin', sysdate(), '', null, ''),
      ('1033', '参数删除', '106', '4', '#', '', '', '', 1, 0, 'F', '0', '0', 'system:config:remove', '#', 'admin', sysdate(), '', null, ''),
      ('1034', '参数导出', '106', '5', '#', '', '', '', 1, 0, 'F', '0', '0', 'system:config:export', '#', 'admin', sysdate(), '', null, ''),
      ('1035', '公告查询', '107', '1', '#', '', '', '', 1, 0, 'F', '0', '0', 'system:notice:query', '#', 'admin', sysdate(), '', null, ''),
      ('1036', '公告新增', '107', '2', '#', '', '', '', 1, 0, 'F', '0', '0', 'system:notice:add', '#', 'admin', sysdate(), '', null, ''),
      ('1037', '公告修改', '107', '3', '#', '', '', '', 1, 0, 'F', '0', '0', 'system:notice:edit', '#', 'admin', sysdate(), '', null, ''),
      ('1038', '公告删除', '107', '4', '#', '', '', '', 1, 0, 'F', '0', '0', 'system:notice:remove', '#', 'admin', sysdate(), '', null, ''),
      ('1039', '操作查询', '500', '1', '#', '', '', '', 1, 0, 'F', '0', '0', 'monitor:operlog:query', '#', 'admin', sysdate(), '', null, ''),
      ('1040', '操作删除', '500', '2', '#', '', '', '', 1, 0, 'F', '0', '0', 'monitor:operlog:remove', '#', 'admin', sysdate(), '', null, ''),
      ('1041', '日志导出', '500', '3', '#', '', '', '', 1, 0, 'F', '0', '0', 'monitor:operlog:export', '#', 'admin', sysdate(), '', null, ''),
      ('1042', '登录查询', '501', '1', '#', '', '', '', 1, 0, 'F', '0', '0', 'monitor:logininfor:query', '#', 'admin', sysdate(), '', null, ''),
      ('1043', '登录删除', '501', '2', '#', '', '', '', 1, 0, 'F', '0', '0', 'monitor:logininfor:remove', '#', 'admin', sysdate(), '', null, ''),
      ('1044', '日志导出', '501', '3', '#', '', '', '', 1, 0, 'F', '0', '0', 'monitor:logininfor:export', '#', 'admin', sysdate(), '', null, ''),
      ('1045', '账户解锁', '501', '4', '#', '', '', '', 1, 0, 'F', '0', '0', 'monitor:logininfor:unlock', '#', 'admin', sysdate(), '', null, ''),
      ('1046', '在线查询', '109', '1', '#', '', '', '', 1, 0, 'F', '0', '0', 'monitor:online:query', '#', 'admin', sysdate(), '', null, ''),
      ('1047', '批量强退', '109', '2', '#', '', '', '', 1, 0, 'F', '0', '0', 'monitor:online:batchLogout', '#', 'admin', sysdate(), '', null, ''),
      ('1048', '单条强退', '109', '3', '#', '', '', '', 1, 0, 'F', '0', '0', 'monitor:online:forceLogout', '#', 'admin', sysdate(), '', null, ''),
      ('1049', '任务查询', '110', '1', '#', '', '', '', 1, 0, 'F', '0', '0', 'monitor:job:query', '#', 'admin', sysdate(), '', null, ''),
      ('1050', '任务新增', '110', '2', '#', '', '', '', 1, 0, 'F', '0', '0', 'monitor:job:add', '#', 'admin', sysdate(), '', null, ''),
      ('1051', '任务修改', '110', '3', '#', '', '', '', 1, 0, 'F', '0', '0', 'monitor:job:edit', '#', 'admin', sysdate(), '', null, ''),
      ('1052', '任务删除', '110', '4', '#', '', '', '', 1, 0, 'F', '0', '0', 'monitor:job:remove', '#', 'admin', sysdate(), '', null, ''),
      ('1053', '状态修改', '110', '5', '#', '', '', '', 1, 0, 'F', '0', '0', 'monitor:job:changeStatus', '#', 'admin', sysdate(), '', null, ''),
      ('1054', '任务导出', '110', '6', '#', '', '', '', 1, 0, 'F', '0', '0', 'monitor:job:export', '#', 'admin', sysdate(), '', null, ''),
      ('1055', '生成查询', '116', '1', '#', '', '', '', 1, 0, 'F', '0', '0', 'tool:gen:query', '#', 'admin', sysdate(), '', null, ''),
      ('1056', '生成修改', '116', '2', '#', '', '', '', 1, 0, 'F', '0', '0', 'tool:gen:edit', '#', 'admin', sysdate(), '', null, ''),
      ('1057', '生成删除', '116', '3', '#', '', '', '', 1, 0, 'F', '0', '0', 'tool:gen:remove', '#', 'admin', sysdate(), '', null, ''),
      ('1058', '导入代码', '116', '4', '#', '', '', '', 1, 0, 'F', '0', '0', 'tool:gen:import', '#', 'admin', sysdate(), '', null, ''),
      ('1059', '预览代码', '116', '5', '#', '', '', '', 1, 0, 'F', '0', '0', 'tool:gen:preview', '#', 'admin', sysdate(), '', null, ''),
      ('1060', '生成代码', '116', '6', '#', '', '', '', 1, 0, 'F', '0', '0', 'tool:gen:code', '#', 'admin', sysdate(), '', null, '');
  `);
  // 初始化-角色菜单关联表数据
  await prisma.$executeRawUnsafe(`
    INSERT INTO sys_role_menu VALUES
      ('2', '1'),
      ('2', '2'),
      ('2', '3'),
      ('2', '4'),
      ('2', '100'),
      ('2', '101'),
      ('2', '102'),
      ('2', '103'),
      ('2', '104'),
      ('2', '105'),
      ('2', '106'),
      ('2', '107'),
      ('2', '108'),
      ('2', '109'),
      ('2', '110'),
      ('2', '111'),
      ('2', '112'),
      ('2', '113'),
      ('2', '114'),
      ('2', '115'),
      ('2', '116'),
      ('2', '117'),
      ('2', '500'),
      ('2', '501'),
      ('2', '1000'),
      ('2', '1001'),
      ('2', '1002'),
      ('2', '1003'),
      ('2', '1004'),
      ('2', '1005'),
      ('2', '1006'),
      ('2', '1007'),
      ('2', '1008'),
      ('2', '1009'),
      ('2', '1010'),
      ('2', '1011'),
      ('2', '1012'),
      ('2', '1013'),
      ('2', '1014'),
      ('2', '1015'),
      ('2', '1016'),
      ('2', '1017'),
      ('2', '1018'),
      ('2', '1019'),
      ('2', '1020'),
      ('2', '1021'),
      ('2', '1022'),
      ('2', '1023'),
      ('2', '1024'),
      ('2', '1025'),
      ('2', '1026'),
      ('2', '1027'),
      ('2', '1028'),
      ('2', '1029'),
      ('2', '1030'),
      ('2', '1031'),
      ('2', '1032'),
      ('2', '1033'),
      ('2', '1034'),
      ('2', '1035'),
      ('2', '1036'),
      ('2', '1037'),
      ('2', '1038'),
      ('2', '1039'),
      ('2', '1040'),
      ('2', '1041'),
      ('2', '1042'),
      ('2', '1043'),
      ('2', '1044'),
      ('2', '1045'),
      ('2', '1046'),
      ('2', '1047'),
      ('2', '1048'),
      ('2', '1049'),
      ('2', '1050'),
      ('2', '1051'),
      ('2', '1052'),
      ('2', '1053'),
      ('2', '1054'),
      ('2', '1055'),
      ('2', '1056'),
      ('2', '1057'),
      ('2', '1058'),
      ('2', '1059'),
      ('2', '1060');
  `);
  // 初始化-部门信息表数据
  await prisma.$executeRawUnsafe(`
    INSERT INTO sys_dept VALUES
      (100,  0,   '0',          '若依科技',   0, '若依', '15888888888', 'ry@qq.com', '0', '0', 'admin', sysdate(), '', null),
      (101,  100, '0,100',      '深圳总公司', 1, '若依', '15888888888', 'ry@qq.com', '0', '0', 'admin', sysdate(), '', null),
      (102,  100, '0,100',      '长沙分公司', 2, '若依', '15888888888', 'ry@qq.com', '0', '0', 'admin', sysdate(), '', null),
      (103,  101, '0,100,101',  '研发部门',   1, '若依', '15888888888', 'ry@qq.com', '0', '0', 'admin', sysdate(), '', null),
      (104,  101, '0,100,101',  '市场部门',   2, '若依', '15888888888', 'ry@qq.com', '0', '0', 'admin', sysdate(), '', null),
      (105,  101, '0,100,101',  '测试部门',   3, '若依', '15888888888', 'ry@qq.com', '0', '0', 'admin', sysdate(), '', null),
      (106,  101, '0,100,101',  '财务部门',   4, '若依', '15888888888', 'ry@qq.com', '0', '0', 'admin', sysdate(), '', null),
      (107,  101, '0,100,101',  '运维部门',   5, '若依', '15888888888', 'ry@qq.com', '0', '0', 'admin', sysdate(), '', null),
      (108,  102, '0,100,102',  '市场部门',   1, '若依', '15888888888', 'ry@qq.com', '0', '0', 'admin', sysdate(), '', null),
      (109,  102, '0,100,102',  '财务部门',   2, '若依', '15888888888', 'ry@qq.com', '0', '0', 'admin', sysdate(), '', null);
  `);
  // 初始化-岗位信息表数据
  await prisma.$executeRawUnsafe(`
    INSERT INTO sys_post VALUES
      (1, 'ceo',  '董事长',    1, '0', 'admin', sysdate(), '', null, ''),
      (2, 'se',   '项目经理',  2, '0', 'admin', sysdate(), '', null, ''),
      (3, 'hr',   '人力资源',  3, '0', 'admin', sysdate(), '', null, ''),
      (4, 'user', '普通员工',  4, '0', 'admin', sysdate(), '', null, '');
  `);
  // 初始化-角色部门关联表数据
  await prisma.$executeRawUnsafe(`
    INSERT INTO sys_role_dept VALUES
      ('2', '100'),
      ('2', '101'),
      ('2', '105');
  `);
  // 初始化-用户岗位关联表数据
  await prisma.$executeRawUnsafe(`
    INSERT INTO sys_user_post VALUES
      ('1', '1'),
      ('2', '2');
  `);
  console.log('数据库初始化完成');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
