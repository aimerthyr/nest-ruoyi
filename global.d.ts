import { SysUser } from '@prisma/client';

// 命名空间 namespace 如果你在当前文件中使用了 import ，会将当前文件变成模块作用域， 那必须加 global 才能实现类型合并
declare global {
  declare namespace NodeJS {
    /** 注意这里的所有类型都是字符串，需要自己手动在使用的地方改成对应的类型 */
    type ProcessEnv = {
      NODE_ENV: 'development';
      DB_HOST: string;
      DB_USERNAME: string;
      DB_PASSWORD: string;
      DB_DATABASE: string;
      DATABASE_URL: string;
      REDIS_HOST: string;
      REDIS_PORT: string;
      JWT_SECRET: string
    };
  }
}

// module 是不需要的，不管你是不是模块作用域，都会进行类型合并
declare module 'express' {
  interface Request {
    user: SysUser;
  }
}
