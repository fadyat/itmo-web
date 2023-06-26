import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Min } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty()
  @IsString()
  body: string;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  postId: number;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  authorId: number;
}
