import { BaseEntity } from '../extra/base.entity';
import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { PostEntity } from '../post/post.entity';
import { CommentEntity } from '../comment/comment.entity';

@Entity({ name: 'users' })
@Index(['id', 'email', 'supertokensUserId'])
export class UserEntity extends BaseEntity {
  @Column({
    nullable: false,
    unique: true,
  })
  name: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({
    nullable: true,
    default:
      'https://i.pinimg.com/736x/e3/a1/bb/e3a1bb585754c76a437567dd7e5cb1a4.jpg',
  })
  photo: string;

  @ManyToMany(() => UserEntity, (u) => u.following, {
    cascade: true,
    nullable: false,
  })
  @JoinTable({
    name: 'subscriptions',
    joinColumn: {
      name: 'followingId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'followerId',
      referencedColumnName: 'id',
    },
  })
  followers: UserEntity[];

  @ManyToMany(() => UserEntity, (u) => u.followers, {
    nullable: false,
  })
  following: UserEntity[];

  @OneToMany(() => PostEntity, (p) => p.author, {
    nullable: true,
    cascade: true,
  })
  posts: PostEntity[];

  @Column({ nullable: true, select: false, unique: true })
  supertokensUserId: string;

  @OneToMany(() => CommentEntity, (c) => c.author, {
    nullable: true,
    cascade: true,
  })
  comments: CommentEntity[];
}
