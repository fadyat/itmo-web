import { ApiProperty } from '@nestjs/swagger';

export class UserWithInfoDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  photo: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  followersCount?: number;

  @ApiProperty()
  followingCount?: number;

  @ApiProperty()
  postsCount?: number;
}
