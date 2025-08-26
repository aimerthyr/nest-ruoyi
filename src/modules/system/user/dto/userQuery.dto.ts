import { PageQueryDTO } from '@common/types';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class UserQueryDTO extends PageQueryDTO {
  @IsOptional()
  @IsNumber()
  deptId?: number;

  @IsOptional()
  @IsString()
  userName?: string;

  @IsOptional()
  @IsString()
  phonenumber?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  'params[beginTime]'?: string;

  @IsOptional()
  @IsString()
  'params[endTime]'?: string;
}

export class UploadFileDTO {
  @IsOptional()
  @IsBoolean()
  updateSupport?: boolean;
}
