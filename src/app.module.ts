import { createKeyv } from '@keyv/redis';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { WinstonModule } from 'nest-winston';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './common/database';
import { winstonConfig } from './common/logger/winston.config';
import { RedisModule } from './common/redis/redis.module';
import { MIN_30 } from './constants';
import { ExceptionsFilter } from './filters';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { PermissionGuard } from './guards/permission.guard';
import { DataScopeInterceptor } from './interceptors';
import { PermissionModule } from './modules/permission/permission.module';
import { SystemModule } from './modules/system/system.module';
import { ServicesModule } from './services/services.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      cache: true,
    }),
    WinstonModule.forRoot(winstonConfig),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => {
        const host = process.env.REDIS_HOST;
        const port = process.env.REDIS_PORT;
        const redisStore = createKeyv(`redis://${host}:${port}`);
        return {
          // 这里可以传入多个，实现多级缓存
          stores: [redisStore],
          // 默认半小时过期
          ttl: MIN_30,
        };
      },
    }),
    DatabaseModule,
    RedisModule,
    PermissionModule,
    SystemModule,
    ServicesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: DataScopeInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: ExceptionsFilter,
    },
  ],
})
export class AppModule {}
