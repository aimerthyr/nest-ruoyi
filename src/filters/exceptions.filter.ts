import { ServiceException } from '@/utils';
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class ExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(ExceptionsFilter.name);

  catch(exception: any, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let code = 500;
    let msg = '服务器内部错误';

    // 自定义业务异常;
    if (exception instanceof ServiceException) {
      const res: any = exception.getResponse();
      msg = res.msg;
      code = res.code;
    } else if (exception instanceof HttpException) {
      const res = exception.getResponse() as any;
      msg = typeof res === 'string' ? res : res.message || msg;
      code = exception.getStatus();
    } else {
      code = 500;
      msg = '服务器内部错误';
    }

    // 非404错误才打印日志
    if (code !== 404) {
      this.logger.error(
        `业务错误码 ${code}，错误信息: ${msg}，请求路径: ${request.method} ${request.url}`,
        exception instanceof Error ? exception.stack : '无堆栈信息',
      );
    }

    // 对外返回统一格式（HTTP 状态码固定 200）
    response.status(200).json({
      code,
      msg,
    });
  }
}
