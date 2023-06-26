import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../extra/base.entity';
import { PostEntity } from '../post/post.entity';
import { UserEntity } from '../user/user.entity';

@Entity({ name: 'comments' })
@Index(['id', 'post'])
export class CommentEntity extends BaseEntity {
  @Column()
  body: string;

  @ManyToOne(() => PostEntity, (p) => p.comments, {
    nullable: true,
  })
  @JoinColumn({ name: 'postId' })
  post: PostEntity;

  @ManyToOne(() => UserEntity, (u) => u.comments, {
    nullable: true,
  })
  @JoinColumn({ name: 'authorId' })
  author: UserEntity;
}
