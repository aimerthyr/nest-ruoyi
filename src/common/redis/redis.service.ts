import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisService {
  private readonly prefix = 'nest-ruoyi:';

  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async get<T = any>(key: string): Promise<T | undefined> {
    return this.cacheManager.get<T>(this.prefix + key);
  }

  async set<T = any>(key: string, value: T, ttl?: number): Promise<void> {
    await this.cacheManager.set(this.prefix + key, value, ttl);
  }

  async del(key: string): Promise<void> {
    await this.cacheManager.del(this.prefix + key);
  }

  async clear(): Promise<void> {
    await this.cacheManager.clear();
  }
}
