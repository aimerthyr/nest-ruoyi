import { AjaxResultUtil } from '@/utils';
import { DatabaseService } from '@common/database';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DictDataService {
  constructor(private readonly _databaseService: DatabaseService) {}

  /** 获取某个字典的全部值 */
  async getDictTypeData(dictType: string) {
    const result = await this._databaseService.sysDictData.findMany({
      where: {
        dict_type: dictType,
        status: '0',
      },
    });
    return AjaxResultUtil.success(result.filter(v => v.status === '0'));
  }
}
