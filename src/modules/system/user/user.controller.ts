import { PageQueryDTO } from '@common/types';
import { DataScope, RequireAllPermission } from '@decorators';
import { Controller, Get, Query, Req } from '@nestjs/common';
import { Request } from 'express';
import { UserService } from './user.service';

@Controller('system/user')
export class UserController {
  constructor(private readonly _userService: UserService) {}

  @RequireAllPermission('system:user:list')
  @DataScope()
  @Get('deptTree')
  getDeptTree(@Req() req: Request) {
    return this._userService.getDeptTree(req.dataScopeFilter);
  }

  @RequireAllPermission('system:user:list')
  @DataScope()
  @Get('list')
  getUserList(@Query() query: PageQueryDTO, @Req() req: Request) {
    return this._userService.getUserList(query, req.dataScopeFilter);
  }
}
