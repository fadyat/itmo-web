import { ApiProperty } from '@nestjs/swagger';

export class PostDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  body: string;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  isPublic: boolean;

  @ApiProperty()
  createdAt: Date;
}
