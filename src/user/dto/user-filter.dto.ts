import { ApiProperty } from '@nestjs/swagger';
import { IsBooleanString, IsOptional } from 'class-validator';

export class UserFilterDto {
  @ApiProperty({ default: false })
  @IsOptional()
  @IsBooleanString()
  includePrivate: boolean | string = 'false';
}
