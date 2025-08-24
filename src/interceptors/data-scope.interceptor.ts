import { DataScopeService } from '@/services/dataScope.service';
import { DATA_SCOPE_KEY, DataScopeQueryType } from '@decorators';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';

/** 数据权限拦截器 */
@Injectable()
export class DataScopeInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly dataScopeService: DataScopeService,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    // 检查 controller 方法上是否有 @DataScope() 装饰器
    const dataScopeQueryType = this.reflector.get<DataScopeQueryType>(
      DATA_SCOPE_KEY,
      context.getHandler(),
    );

    // 如果没有 @DataScope() 装饰器，直接执行原方法
    if (!dataScopeQueryType) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user;
    const dataScopeFilter = await this.dataScopeService.getDataScopeFilter(
      user,
      dataScopeQueryType,
    );
    request.dataScopeFilter = dataScopeFilter;
    return next.handle();
  }
}
