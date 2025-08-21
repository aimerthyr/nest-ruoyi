import { Global, Module } from '@nestjs/common';
import { DataScopeService } from './dataScope.service';

@Global()
@Module({
  providers: [DataScopeService],
  exports: [DataScopeService],
})
export class ServicesModule {}
