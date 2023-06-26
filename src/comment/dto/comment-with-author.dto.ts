import { UserDto } from '../../user/dto/user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CommentWithAuthorDto {
  @ApiProperty()
  body: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  id: number;

  @ApiProperty()
  author: UserDto;
}
