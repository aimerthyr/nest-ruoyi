import { Public } from '@decorators';
import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { LoginDTO } from './dto/login.dto';
import { PermissionService } from './permission.service';

@Controller()
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Public()
  @Get('captchaImage')
  captchaImage() {
    return this.permissionService.getCaptchaImage();
  }

  @Public()
  @Post('login')
  login(@Body() loginDto: LoginDTO) {
    return this.permissionService.login(loginDto);
  }

  @Get('getInfo')
  getInfo(@Req() req: Request) {
    return this.permissionService.getUserInfo(req.user);
  }

  @Get('getRouters')
  getRouters(@Req() req: Request) {
    return this.permissionService.getRouters(req.user.roleKeys);
  }
}
