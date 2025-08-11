import { AjaxResultUtil } from '@/utils';
import { DatabaseService } from '@common/database';
import { RedisService } from '@common/redis';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcrypt';
import { createMathExpr } from 'svg-captcha';
import { v4 as uuidv4 } from 'uuid';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class PermissionService {
  constructor(
    private readonly _redisService: RedisService,
    private readonly _databaseService: DatabaseService,
    private readonly _jwtService: JwtService,
  ) {}

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
    return AjaxResultUtil.customSuccess({
      img,
      uuid,
      captchaEnabled: true,
    });
  }

  private _generateToken(userId: bigint) {
    return this._jwtService.sign(
      {
        sub: userId.toString(),
      },
      {
        secret: process.env.JWT_SECRET,
      },
    );
  }

  async login(loginDto: LoginDto) {
    // 获取验证码答案
    const answer = await this._redisService.get(`captcha:${loginDto.uuid}`);
    if (answer !== loginDto.code) {
      throw AjaxResultUtil.error('验证码错误');
    }
    const user = await this._databaseService.sysUser.findFirst({
      where: {
        user_name: loginDto.username,
      },
    });
    if (!user) {
      throw AjaxResultUtil.error('用户不存在/密码错误');
    }
    const isPasswordValid = compareSync(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw AjaxResultUtil.error('用户不存在/密码错误');
    }
    const token = this._generateToken(user.user_id);
    return AjaxResultUtil.customSuccess({
      token,
    });
  }
}
