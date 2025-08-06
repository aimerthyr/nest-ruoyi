import { Body, Controller, Get, Post } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { PermissionService } from './permission.service';

@Controller()
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get('captchaImage')
  captchaImage() {
    return this.permissionService.getCaptchaImage();
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.permissionService.login(loginDto);
  }
}
