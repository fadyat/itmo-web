import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
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

  @ApiProperty({
    description: 'The current user has a subscription to this user',
    default: false,
  })
  follows?: boolean = false;
}
