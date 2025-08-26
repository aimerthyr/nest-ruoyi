import { PageQueryDTO } from '@common/types';
import { DataScope, RequireAllPermission } from '@decorators';
import {
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { UploadFileDTO, UserQueryDTO } from './dto/userQuery.dto';
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
}
