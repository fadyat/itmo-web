import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query, UnauthorizedException,
  UseGuards
} from "@nestjs/common";
import { PostService } from './post.service';
import {
  ApiBadRequestResponse,
  ApiCookieAuth,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CreatePostDto } from './dto/create-post.dto';
import { ModifyPostDto } from './dto/modify-post.dto';
import { PageDto } from '../extra/pagination/page.dto';
import { PostWithAuthorDto } from './dto/post-with-author.dto';
import { PostFilterDto } from './dto/post-filter.dto';
import { ResponseError } from '../extra/error-response';
import { SuccessResponse } from '../extra/success-response';
import { PageOptions } from '../extra/pagination/options';
import { ApiPaginatedResponse } from '../extra/pagination/decorator';
import { AuthGuard, OptionalAuthGuard } from '../auth/auth.guard';
import { Session } from '../auth/session.decorator';
import { UserService } from '../user/user.service';

@Controller('/api/v1/posts')
@ApiTags('posts')
export class PostController {
  constructor(
    private postService: PostService,
    private userService: UserService,
  ) {}

  @Get()
  @UseGuards(OptionalAuthGuard)
  @ApiPaginatedResponse(PostWithAuthorDto)
  @ApiBadRequestResponse({ type: ResponseError })
  @ApiForbiddenResponse({ type: ResponseError })
  @ApiInternalServerErrorResponse({ type: ResponseError })
  async getPosts(
    @Session() session,
    @Query() postFilterDto: PostFilterDto,
    @Query() pageOptionsDto: PageOptions,
  ): Promise<PageDto<PostWithAuthorDto>> {
    if (
      postFilterDto.isPublic == false &&
      (!session || !postFilterDto.authorId)
    ) {
      throw new ForbiddenException(
        "can't access private posts without auth, or author selection",
      );
    }

    if (postFilterDto.isPublic == false) {
      const curUser = await this.userService.getUserBySupertokensId(
        session.getUserId(),
      );

      if (curUser.id != postFilterDto.authorId) {
        throw new ForbiddenException(
          "can't access private posts of other user",
        );
      }
    }

    return await this.postService.getPosts(postFilterDto, pageOptionsDto);
  }

  @Get(':id')
  @UseGuards(OptionalAuthGuard)
  @ApiOkResponse({ type: PostWithAuthorDto })
  @ApiBadRequestResponse({ type: ResponseError })
  @ApiUnauthorizedResponse({ type: ResponseError })
  @ApiNotFoundResponse({ type: ResponseError })
  @ApiInternalServerErrorResponse({ type: ResponseError })
  async findOne(
    @Session() session,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PostWithAuthorDto> {
    const post = await this.postService.getPost(id);

    if (post.isPublic) {
      return post;
    }

    if (!session) {
      throw new UnauthorizedException("can't access private posts without auth");
    }

    const curUser = await this.userService.getUserBySupertokensId(
      session.getUserId(),
    );

    if (curUser.id != post.author.id) {
      throw new ForbiddenException("can't access private posts of other user");
    }

    return post;
  }

  @Post()
  @UseGuards(AuthGuard)
  @ApiCookieAuth()
  @ApiOkResponse({ type: SuccessResponse })
  @ApiBadRequestResponse({ type: ResponseError })
  @ApiUnauthorizedResponse({ type: ResponseError })
  @ApiForbiddenResponse({ type: ResponseError })
  @ApiNotFoundResponse({ type: ResponseError })
  @ApiInternalServerErrorResponse({ type: ResponseError })
  async createPost(
    @Session() session,
    @Body() createPostDto: CreatePostDto,
  ): Promise<SuccessResponse> {
    const curUser = await this.userService.getUserBySupertokensId(
      session.getUserId(),
    );

    if (curUser.id != createPostDto.authorId) {
      throw new ForbiddenException('not enough rights');
    }

    await this.postService.createPost(createPostDto);
    return new SuccessResponse('ok');
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiCookieAuth()
  @ApiOkResponse({ type: SuccessResponse })
  @ApiBadRequestResponse({ type: ResponseError })
  @ApiUnauthorizedResponse({ type: ResponseError })
  @ApiNotFoundResponse({ type: ResponseError })
  @ApiInternalServerErrorResponse({ type: ResponseError })
  async deletePost(
    @Session() session,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SuccessResponse> {
    const curUser = await this.userService.getUserBySupertokensId(
      session.getUserId(),
    );

    await this.postService.deletePost(id, curUser.id);
    return new SuccessResponse('ok');
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @ApiCookieAuth()
  @ApiOkResponse({ type: SuccessResponse })
  @ApiBadRequestResponse({ type: ResponseError })
  @ApiUnauthorizedResponse({ type: ResponseError })
  @ApiNotFoundResponse({ type: ResponseError })
  @ApiInternalServerErrorResponse({ type: ResponseError })
  async modifyPost(
    @Session() session,
    @Param('id', ParseIntPipe) id: number,
    @Body() modifyPostDto: ModifyPostDto,
  ): Promise<SuccessResponse> {
    const curUser = await this.userService.getUserBySupertokensId(
      session.getUserId(),
    );

    if (curUser.id != modifyPostDto.authorId) {
      throw new ForbiddenException('not enough rights');
    }

    await this.postService.modifyPost(id, modifyPostDto);
    return new SuccessResponse('ok');
  }
}
