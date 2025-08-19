import { Body, Controller, Get, Param } from '@nestjs/common';
import { DictDataService } from './dict-data.service';

@Controller('system/dict/data')
export class DictDataController {
  constructor(private readonly _dictService: DictDataService) {}

  @Get('type/:dictType')
  getDataByType(@Param('dictType') dictType: string) {
    return this._dictService.getDictTypeData(dictType);
  }
}
