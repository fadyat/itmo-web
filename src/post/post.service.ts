import { Injectable } from '@nestjs/common';
import { PostEntity } from './post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PageDto } from '../extra/pagination/page.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { PostWithAuthorDto } from './dto/post-with-author.dto';
import { PostFilterDto } from './dto/post-filter.dto';
import { ModifyPostDto } from './dto/modify-post.dto';
import { PageOptions } from '../extra/pagination/options';
import { PageMeta } from '../extra/pagination/meta';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private postRepo: Repository<PostEntity>,
  ) {}

  async getPosts(
    postFilterDto: PostFilterDto,
    pageOptionsDto: PageOptions,
  ): Promise<PageDto<PostWithAuthorDto>> {
    let qb = this.postRepo
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author');

    qb = postFilterDto
      .applyFilters(qb)
      .orderBy('post.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    const itemCount = await qb.getCount();
    const { entities } = await qb.getRawAndEntities();

    return new PageDto(entities, new PageMeta({ itemCount, pageOptionsDto }));
  }

  async getPost(id: number): Promise<PostWithAuthorDto> {
    return this.postRepo
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .where('post.id = :id', { id })
      .getOneOrFail();
  }

  async createPost(createPostDto: CreatePostDto): Promise<void> {
    await this.postRepo
      .createQueryBuilder()
      .insert()
      .into(PostEntity)
      .values({
        body: createPostDto.body,
        name: createPostDto.name,
        isPublic: createPostDto.isPublic,
        author: { id: createPostDto.authorId },
      })
      .execute();
  }

  async modifyPost(id: number, modifyPostDto: ModifyPostDto): Promise<void> {
    await this.postRepo
      .createQueryBuilder()
      .update(PostEntity)
      .set({
        name: modifyPostDto.name,
        body: modifyPostDto.body,
        isPublic: modifyPostDto.isPublic,
        author: { id: modifyPostDto.authorId },
      })
      .where('id = :id', { id: id })
      .execute();
  }

  async deletePost(id: number, authorId: number): Promise<void> {
    await this.postRepo
      .createQueryBuilder()
      .delete()
      .from(PostEntity)
      .where('id = :id', { id })
      .andWhere('authorId = :authorId', { authorId })
      .execute();
  }
}
