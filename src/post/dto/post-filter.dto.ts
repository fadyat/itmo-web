import { SelectQueryBuilder } from 'typeorm';
import { PostEntity } from '../post.entity';
import { IsBoolean, IsBooleanString, IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiCookieAuth, ApiPropertyOptional } from '@nestjs/swagger';

export class PostFilterDto {
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  @ApiPropertyOptional()
  authorId: number;

  @IsBooleanString()
  @IsOptional()
  @ApiPropertyOptional({
    default: null,
    description:
      'when curUserId == authorId, can provide private posts, else only public',
  })
  isPublic: boolean;

  applyFilters(
    qb: SelectQueryBuilder<PostEntity>,
  ): SelectQueryBuilder<PostEntity> {
    if (this.authorId) {
      qb.andWhere('author.id = :id', { id: this.authorId });
    }

    if (this.isPublic !== undefined) {
      qb.andWhere('post.isPublic = :isPublic', { isPublic: this.isPublic });
    }

    return qb;
  }
}
