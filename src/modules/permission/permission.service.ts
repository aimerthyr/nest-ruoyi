import { RedisService } from '@common/redis';
import { Injectable } from '@nestjs/common';
import { createMathExpr } from 'svg-captcha';
import { v4 as uuidv4 } from 'uuid';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class PermissionService {
  constructor(private readonly _redisService: RedisService) {}

  /** 创建算式验证码图片 */
  private _createCaptchaImage(): { uuid: string; img: string } {
    const { text, data } = createMathExpr({
      mathMax: 10,
      mathMin: 1,
    });
    const uuid = uuidv4();
    this._redisService.set(`captcha:${uuid}`, text, 15000);
    return {
      img: Buffer.from(data).toString('base64'),
      uuid,
    };
  }

  /** 获取验证码 */
  getCaptchaImage() {
    const { uuid, img } = this._createCaptchaImage();
    return {
      msg: '操作成功',
      img,
      code: 200,
      captchaEnabled: true,
      uuid,
    };
  }

  login(loginDto: LoginDto) {
    console.log(loginDto);
  }
}
