import { ApiProperty } from '@nestjs/swagger';
import { PageOptions } from './options';

export interface PageMetaDtoParameters {
  pageOptionsDto: PageOptions;
  itemCount: number;
}

export class PageMeta {
  @ApiProperty()
  readonly page: number;

  @ApiProperty()
  readonly take: number;

  @ApiProperty()
  readonly itemCount: number;

  @ApiProperty()
  readonly pageCount: number;

  @ApiProperty()
  readonly hasPrev: boolean;

  @ApiProperty()
  readonly hasNext: boolean;

  constructor({ pageOptionsDto, itemCount }: PageMetaDtoParameters) {
    this.page = pageOptionsDto.page;
    this.take = pageOptionsDto.take;
    this.itemCount = itemCount;
    this.pageCount = Math.ceil(this.itemCount / this.take);
    this.hasPrev = this.page > 1;
    this.hasNext = this.page < this.pageCount;
  }
}
