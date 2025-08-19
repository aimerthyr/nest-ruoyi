import { Module } from '@nestjs/common';
import { DictDataModule } from './dict-data/dict-data.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [DictDataModule, UserModule],
})
export class SystemModule {}
