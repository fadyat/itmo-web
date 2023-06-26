import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '../../user/dto/user.dto';

export class PostWithAuthorDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  body: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  isPublic: boolean;

  @ApiProperty()
  author: UserDto;
}
