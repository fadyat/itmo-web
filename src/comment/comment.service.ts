import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CommentEntity } from './comment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PageOptions } from '../extra/pagination/options';
import { PageDto } from '../extra/pagination/page.dto';
import { PageMeta } from '../extra/pagination/meta';
import { CommentWithAuthorDto } from './dto/comment-with-author.dto';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private commRepo: Repository<CommentEntity>,
  ) {}

  async getPostComments(
    postId: number,
    pageOptionsDto: PageOptions,
  ): Promise<PageDto<CommentWithAuthorDto>> {
    const qb = this.commRepo
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.author', 'author')
      .where('comment.postId = :postId', { postId })
      .orderBy('comment.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    const itemCount = await qb.getCount();
    const { entities } = await qb.getRawAndEntities();

    return new PageDto(entities, new PageMeta({ itemCount, pageOptionsDto }));
  }

  async createPostComment(createCommentDto: CreateCommentDto) {
    await this.commRepo
      .createQueryBuilder()
      .insert()
      .into(CommentEntity)
      .values({
        body: createCommentDto.body,
        post: { id: createCommentDto.postId },
        author: { id: createCommentDto.authorId },
      })
      .execute();
  }
}
