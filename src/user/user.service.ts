import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { UserDto } from './dto/user.dto';
import { PageDto } from '../extra/pagination/page.dto';
import { UserSubscriptionDto } from './dto/user.subscription.dto';
import { UserWithInfoDto } from './dto/user-with-info.dto';
import { PageOptions } from '../extra/pagination/options';
import { PageMeta } from '../extra/pagination/meta';
import { CreateUserDto } from './dto/create-user.dto';
import { UserFilterDto } from './dto/user-filter.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
  ) {}

  async getUsers(
    pageOptionsDto: PageOptions,
    supertokensUserId?: string,
  ): Promise<PageDto<UserDto>> {
    const qb = this.userRepo
      .createQueryBuilder('user')
      .orderBy('user.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    if (supertokensUserId) {
      // todo: do from sql
      const curUser = await this.getUserBySupertokensId(supertokensUserId);

      qb.addSelect(
        `user.id IN (
        SELECT DISTINCT s2."followingId"
        FROM subscriptions s2
        WHERE s2."followerId" = :idd
        )`,
        'follows',
      ).setParameter('idd', curUser.id);
    }

    const itemCount = await qb.getCount();
    const { entities, raw } = await qb.getRawAndEntities();

    const users = entities.map((entity, index) => {
      const user = entity as UserDto;
      user.follows = raw[index].follows || false;
      return user;
    });

    return new PageDto(users, new PageMeta({ itemCount, pageOptionsDto }));
  }

  async follow(userSubscriptionDto: UserSubscriptionDto): Promise<void> {
    await this.userRepo
      .createQueryBuilder()
      .relation(UserEntity, 'following')
      .of({ id: userSubscriptionDto.sourceId })
      .add({ id: userSubscriptionDto.targetId });
  }

  async unfollow(userSubscriptionDto: UserSubscriptionDto): Promise<void> {
    await this.userRepo
      .createQueryBuilder()
      .relation(UserEntity, 'following')
      .of({ id: userSubscriptionDto.sourceId })
      .remove({ id: userSubscriptionDto.targetId });
  }

  async getUserFollowers(
    id: number,
    pageOptionsDto: PageOptions,
    supertokensUserId?: string,
  ): Promise<PageDto<UserDto>> {
    const qb = this.userRepo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.followers', 'followers')
      .orderBy('followers.name', pageOptionsDto.order)
      .where('user.id = :id', { id })
      .offset(pageOptionsDto.skip)
      .limit(pageOptionsDto.take);

    if (supertokensUserId) {
      // todo: do from sql
      const curUser = await this.getUserBySupertokensId(supertokensUserId);

      qb.addSelect(
        `:idd IN (
        SELECT DISTINCT s2."followerId"
        FROM subscriptions s2
        WHERE s2."followingId" = followers.id
      )`,
        'follows',
      ).setParameter('idd', curUser.id);
    }

    const itemCount = await qb.getCount();
    const { entities, raw } = await qb.getRawAndEntities();
    const entity = entities.length ? entities[0] : null;

    const followers =
      entity?.followers?.map((follower, index) => {
        const user = follower as UserDto;
        user.follows = raw[index].follows || false;
        return user;
      }) || [];

    return new PageDto(followers, new PageMeta({ itemCount, pageOptionsDto }));
  }

  async getUserFollowing(
    id: number,
    pageOptionsDto: PageOptions,
    supertokensUserId?: string,
  ): Promise<PageDto<UserDto>> {
    const qb = this.userRepo
      .createQueryBuilder('user')
      .innerJoinAndSelect('user.following', 'following')
      .orderBy('following.name', pageOptionsDto.order)
      .where('user.id = :id', { id })
      .offset(pageOptionsDto.skip)
      .limit(pageOptionsDto.take);

    if (supertokensUserId) {
      // todo: do from sql
      const curUser = await this.getUserBySupertokensId(supertokensUserId);

      qb.addSelect(
        `:idd IN (
        SELECT DISTINCT s2."followerId"
        FROM subscriptions s2
        WHERE s2."followingId" = following.id
      )`,
        'follows',
      ).setParameter('idd', curUser.id);
    }

    const itemCount = await qb.getCount();
    const { entities, raw } = await qb.getRawAndEntities();
    const entity = entities.length ? entities[0] : null;

    const following =
      entity?.following?.map((follower, index) => {
        const user = follower as UserDto;
        user.follows = raw[index].follows || false;
        return user;
      }) || [];

    return new PageDto<UserDto>(
      following,
      new PageMeta({ itemCount, pageOptionsDto }),
    );
  }

  async getUserByUsername(
    username: string,
    userFilterDto: UserFilterDto,
  ): Promise<UserWithInfoDto> {
    const qb = this.userRepo
      .createQueryBuilder('user')
      .where('user.name = :username', { username })
      .loadRelationCountAndMap('user.followingCount', 'user.following')
      .loadRelationCountAndMap('user.followersCount', 'user.followers');

    if (userFilterDto.includePrivate === 'false') {
      qb.loadRelationCountAndMap(
        'user.postsCount',
        'user.posts',
        'posts',
        (q) => q.andWhere('posts.isPublic = true'),
      );
    } else {
      qb.loadRelationCountAndMap('user.postsCount', 'user.posts');
    }

    return await qb.getOneOrFail();
  }

  async getUserBySupertokensId(supertokensUserId: string): Promise<UserDto> {
    return await this.userRepo
      .createQueryBuilder('user')
      .where('user.supertokensUserId = :supertokensUserId', {
        supertokensUserId,
      })
      .getOneOrFail();
  }

  async createUser(userDto: CreateUserDto) {
    await this.userRepo
      .createQueryBuilder()
      .insert()
      .into(UserEntity)
      .values({
        name: userDto.name,
        email: userDto.email,
        photo: userDto.photo,
        supertokensUserId: userDto.supertokensUserId,
      })
      .execute();
  }
}
