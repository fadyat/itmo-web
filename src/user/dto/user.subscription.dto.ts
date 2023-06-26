import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';

export class UserSubscriptionDto {
  @ApiProperty({
    description: 'id of the user, who performs the unfollow/follow operation',
  })
  @IsNumber()
  @Min(1)
  sourceId: number;

  @ApiProperty({
    description: 'id of the user, who was/will be subscribed to',
  })
  @IsNumber()
  @Min(1)
  targetId: number;
}
