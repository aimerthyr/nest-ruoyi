import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async get<T = any>(key: string): Promise<T | null> {
    const data = await this.cacheManager.get<string>(key);
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch {
      // 如果不是 JSON，就直接返回原值（比如纯字符串）
      return data as T;
    }
  }

  async set<T = any>(key: string, value: T, ttl?: number): Promise<void> {
    const strValue = JSON.stringify(value);
    await this.cacheManager.set(key, strValue, ttl);
  }

  async del(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }

  async clear(): Promise<void> {
    await this.cacheManager.clear();
  }
}
