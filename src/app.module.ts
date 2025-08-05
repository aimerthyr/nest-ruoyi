import { createKeyv } from '@keyv/redis';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './common/database';
import { RedisModule } from './common/redis/redis.module';
import { PermissionModule } from './modules/permission/permission.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      cache: true,
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => {
        const host = process.env.REDIS_HOST;
        const port = process.env.REDIS_PORT;
        const redisStore = createKeyv(`redis://${host}:${port}`);
        return {
          // 这里可以传入多个，实现多级缓存
          stores: [redisStore],
          ttl: 10 * 1000,
        };
      },
    }),
    DatabaseModule,
    RedisModule,
    PermissionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
