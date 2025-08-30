### Nest 版若依后台管理系统（基于若依 v3.9.0 版本）

#### 功能模块拆解

- [x] 验证码获取
- [x] 登录
- [x] 基于角色的功能权限校验
- [x] 用户信息和动态路由
- [x] 用户管理增删改查
- [ ] 剩余模块，以及定时任务（后续有时间再完成吧）

#### 启动方式

```bash
# 启动命令之前，需要保证你已经安装了 docker ,并且已经启动
# 第一步
pnpm start:dev

# 第二步 (执行迁移文件并初始化数据库，只需要执行一次即可)
pnpm migrate:dev
pnpm seed
```

#### 前端地址

```bash
# https://github.com/aimerthyr/nest-ruoyi-vue3
git clone git@github.com:aimerthyr/nest-ruoyi-vue3.git

# 启动，即可连接本地的 nest 后端服务
npm run dev
```
