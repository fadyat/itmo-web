import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from '../extra/base.entity';
import { UserEntity } from '../user/user.entity';
import { CommentEntity } from '../comment/comment.entity';

@Entity({ name: 'posts' })
@Index(['id'])
export class PostEntity extends BaseEntity {
  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  body: string;

  @Column({ nullable: false, default: () => 'current_timestamp' })
  updatedAt: Date;

  @Column({ nullable: false, default: true })
  isPublic: boolean;

  @ManyToOne(() => UserEntity, (u) => u.posts, {
    nullable: false,
  })
  @JoinColumn({ name: 'authorId' })
  author: UserEntity;

  @OneToMany(() => CommentEntity, (c) => c.post, {
    nullable: true,
    cascade: true,
  })
  comments: CommentEntity[];
}
