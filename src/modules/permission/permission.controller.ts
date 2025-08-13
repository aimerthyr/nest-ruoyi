import { Public } from '@decorators';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { Request } from 'express';
import { LoginDto } from './dto/login.dto';
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
  login(@Body() loginDto: LoginDto) {
    return this.permissionService.login(loginDto);
  }
}
