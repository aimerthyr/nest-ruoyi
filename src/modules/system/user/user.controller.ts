import { PageQueryDTO } from '@common/types';
import { DataScope, RequireAllPermission } from '@decorators';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { UserCreateDTO } from './dto/userCreate.dto';
import { UploadFileDTO, UserQueryDTO } from './dto/userQuery.dto';
import { UserChangeStatusDTO, UserUpdateDTO } from './dto/userUpdate.dto';
import { UserService } from './user.service';

@Controller('system/user')
export class UserController {
  constructor(private readonly _userService: UserService) {}

  @RequireAllPermission('system:user:list')
  @DataScope('dept')
  @Get('deptTree')
  getDeptTree(@Req() req: Request) {
    return this._userService.getDeptTree(req.dataScopeFilter);
  }

  @RequireAllPermission('system:user:list')
  @DataScope('user')
  @Get('list')
  getUserList(@Query() query: UserQueryDTO, @Req() req: Request) {
    return this._userService.getUserList(query, req.dataScopeFilter);
  }

  @RequireAllPermission('system:user:import')
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File, @Query() query: UploadFileDTO) {
    // TODO: 上传文件(后续将文件传给 xlsx 进行处理，常规做法是，通过表头，建立列索引，然后遍历行，对每个单元格格式处理，最后通过批量入库)
    console.log(file, query.updateSupport);
    return 'success';
  }

  @RequireAllPermission('system:user:export')
  @Post('export')
  async exportFile(@Query() query: PageQueryDTO, @Req() req: Request, @Res() res: Response) {
    const buffer = await this._userService.exportFile(query, req.dataScopeFilter);
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent('用户列表.xlsx')}`,
    });
    res.send(buffer);
  }

  @Get()
  getUserCreateConf(@Req() req: Request) {
    return this._userService.getUserCreateConf(req.user);
  }

  @RequireAllPermission('system:user:add')
  @Post()
  createUser(@Body() createDTO: UserCreateDTO) {
    return this._userService.createUser(createDTO);
  }

  @RequireAllPermission('system:user:query')
  @Get(':userId')
  getUserInfo(@Param('userId') userId: number) {
    return this._userService.getUserInfo(userId);
  }

  @RequireAllPermission('system:user:remove')
  @Delete(':userId')
  deleteUser(@Param('userId') userId: number) {
    return this._userService.deleteUser(userId);
  }

  @RequireAllPermission('system:user:edit')
  @Put()
  updateUser(@Body() updateDTO: UserUpdateDTO) {
    return this._userService.updateUser(updateDTO);
  }

  @RequireAllPermission('system:user:edit')
  @Put('/changeStatus')
  changeStatus(@Body() changeStatusDTO: UserChangeStatusDTO) {
    return this._userService.changeStatus(changeStatusDTO);
  }
}
