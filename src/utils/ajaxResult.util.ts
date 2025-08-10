import { HttpException, HttpStatus } from '@nestjs/common';

/** 自定义的服务类异常 */
export class ServiceException extends HttpException {
  constructor(msg = '操作失败', code = 500) {
    super({ code, msg }, HttpStatus.OK);
  }
}

/** 统一的 API 响应类 */
export class AjaxResult {
  /** 成功的响应（默认响应体） */
  static success<T>(data: T, msg = '操作成功'): { code: number; msg: string; data: T } {
    return {
      code: 200,
      msg,
      data,
    };
  }

  /** 成功的响应（自定义响应体） */
  static customSuccess<T extends object>(result: T): T {
    return {
      code: 200,
      msg: (result as any).msg || '操作成功',
      ...result,
    };
  }

  /** 服务异常 */
  static error(msg = '操作失败', code = 500) {
    return new ServiceException(msg, code);
  }

  /** 分页查询 */
  static page<T>(rows: T[], total: number) {
    return {
      code: 200,
      msg: '查询成功',
      rows,
      total,
    };
  }
}
