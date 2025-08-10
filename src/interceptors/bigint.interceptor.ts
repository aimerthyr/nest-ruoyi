import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

function bigintReplacer(_key: string, value: any) {
  return typeof value === 'bigint' ? value.toString() : value;
}

@Injectable()
export class BigintInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(data => {
        // 先转成JSON字符串，替换bigint为字符串，再解析回普通对象
        return JSON.parse(JSON.stringify(data, bigintReplacer));
      }),
    );
  }
}
