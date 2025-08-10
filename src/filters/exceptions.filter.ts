import { ServiceException } from '@/utils';
import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
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

    // 自定义异常从 response 中拿到信息
    if (exception instanceof ServiceException) {
      const res: any = exception.getResponse();
      msg = res.msg;
      code = res.code;
    } else {
      msg = exception.message;
      code = exception?.getStatus?.();
    }

    // 非404错误才打印日志
    if (code !== 404) {
      this.logger.error(
        `业务错误码 ${code}，错误信息: ${msg}，请求路径: ${request.method} ${request.url}`,
        exception instanceof Error ? exception.stack : '无堆栈信息',
      );
    }

    // 返回统一格式，HTTP状态码固定设置为 200
    response.status(200).json({
      code,
      msg,
    });
  }
}
