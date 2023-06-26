import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from './post.entity';
import { UserService } from '../user/user.service';
import { UserEntity } from '../user/user.entity';

@Module({
  controllers: [PostController],
  providers: [PostService, UserService],
  imports: [TypeOrmModule.forFeature([PostEntity, UserEntity])],
})
export class PostModule {}
