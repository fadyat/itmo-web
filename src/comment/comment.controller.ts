import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { PageOptions } from '../extra/pagination/options';
import { CommentService } from './comment.service';
import { PageDto } from '../extra/pagination/page.dto';
import { CommentWithAuthorDto } from './dto/comment-with-author.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { SuccessResponse } from '../extra/success-response';
import {
  ApiBadRequestResponse,
  ApiCookieAuth,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard, OptionalAuthGuard } from '../auth/auth.guard';
import { Session } from '../auth/session.decorator';
import { UserService } from '../user/user.service';
import { ResponseError } from '../extra/error-response';
import { PostService } from '../post/post.service';

@Controller('/api/v1')
@ApiTags('comments')
export class CommentController {
  constructor(
    private commentService: CommentService,
    private userService: UserService,
    private postService: PostService,
  ) {}

  @Get('/posts/:postId/comments')
  @UseGuards(OptionalAuthGuard)
  async getPostComments(
    @Session() session,
    @Param('postId', ParseIntPipe) postId: number,
    @Query() pageOptionsDto: PageOptions,
  ): Promise<PageDto<CommentWithAuthorDto>> {
    const post = await this.postService.getPost(postId);

    if (!session && !post.isPublic) {
      throw new UnauthorizedException(
        'You must be logged in to view this post',
      );
    }

    if (!session) {
      return await this.commentService.getPostComments(postId, pageOptionsDto);
    }

    const curUser = await this.userService.getUserBySupertokensId(
      session?.getUserId(),
    );

    if (curUser.id !== post.author.id && !post.isPublic) {
      throw new ForbiddenException('You are not the author of this post');
    }

    return await this.commentService.getPostComments(postId, pageOptionsDto);
  }

  @Post('/comments')
  @ApiCookieAuth()
  @UseGuards(AuthGuard)
  @ApiOkResponse({ type: SuccessResponse })
  @ApiBadRequestResponse({ type: ResponseError })
  @ApiForbiddenResponse({ type: ResponseError })
  @ApiInternalServerErrorResponse({ type: ResponseError })
  async createPostComment(
    @Session() session,
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<SuccessResponse> {
    const curUser = await this.userService.getUserBySupertokensId(
      session?.getUserId(),
    );

    if (curUser.id !== createCommentDto.authorId) {
      throw new BadRequestException('You are not the author of this comment');
    }

    await this.commentService.createPostComment(createCommentDto);
    return new SuccessResponse('ok');
  }
}
