import { IsNumber } from 'class-validator';

export class PageQueryDTO {
  @IsNumber()
  pageNum: number = 1;

  @IsNumber()
  pageSize: number = 10;
}
