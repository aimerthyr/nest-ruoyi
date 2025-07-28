import { Global, Module } from '@nestjs/common';
import { DatabaseService } from './database.service';

/** Global 装饰器表示就只需要在 app 中导入一次就能变成全局可用了，它 export 的 service 也会变成全局的 */
@Global()
@Module({
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
