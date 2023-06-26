import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

export enum ProfileTabs {
  followers = 'followers',
  following = 'following',
  posts = 'posts',
}

export class Tab {
  @ApiPropertyOptional({ enum: ProfileTabs, default: ProfileTabs.posts })
  @IsEnum(ProfileTabs)
  @IsOptional()
  readonly tab?: ProfileTabs = ProfileTabs.posts;
}
