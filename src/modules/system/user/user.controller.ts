import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('system/user')
export class UserController {
  constructor(private readonly _userService: UserService) {}

  @Get('deptTree')
  getDeptTree() {
    return this._userService.getDeptTree();
  }
}
