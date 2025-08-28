import { Transform } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsIn,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class UserCreateDTO {
  @IsString()
  nickName: string;
  @IsString()
  userName: string;
  @IsString()
  password: string;

  @IsOptional()
  @IsNumber()
  deptId?: number;

  @IsOptional()
  @IsString()
  @IsPhoneNumber()
  @Transform(({ value }) => (value === '' ? undefined : value))
  phonenumber?: string;

  @IsOptional()
  @IsString()
  @IsEmail()
  @Transform(({ value }) => (value === '' ? undefined : value))
  email?: string;

  @IsOptional()
  @IsString()
  @IsIn(['0', '1'])
  sex?: '0' | '1';

  @IsOptional()
  @IsString()
  @IsIn(['0', '1'])
  status?: '0' | '1';

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  postIds?: number[];

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  roleIds?: number[];

  @IsOptional()
  @IsString()
  remark?: string;
}
