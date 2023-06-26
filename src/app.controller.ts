import {
  Controller,
  Get,
  Param,
  Query,
  Render,
  UseGuards,
  UseInterceptors,
  Headers,
  Head,
} from '@nestjs/common';
import {
  CurrentPageInterceptor,
  CurrentUserInterceptor,
  ServerLoadTimeInterceptor,
} from './app.interceptor';
import { PageDto } from './extra/pagination/page.dto';
import { doReq, getRequestOptionsWithCookies } from './extra/request';
import { UserDto } from './user/dto/user.dto';
import { UserWithInfoDto } from './user/dto/user-with-info.dto';
import { PostWithAuthorDto } from './post/dto/post-with-author.dto';
import { ProfileTabs, Tab } from './extra/profile-tabs';
import { PageOptions } from './extra/pagination/options';
import { AuthGuard, OptionalAuthGuard } from './auth/auth.guard';
import { ApiExcludeController } from '@nestjs/swagger';
import { Session } from './auth/session.decorator';
import { CommentWithAuthorDto } from './comment/dto/comment-with-author.dto';
import * as process from "process";

@Controller()
@UseInterceptors(
  ServerLoadTimeInterceptor,
  CurrentUserInterceptor,
  CurrentPageInterceptor,
)
@ApiExcludeController()
export class AppController {
  @Get('/newbie')
  @Render('posts/newbie')
  @UseGuards(OptionalAuthGuard)
  async getNewbiesPosts(@Query() pageOptions: PageOptions) {
    const postsEndpoint = `${process.env.BACKEND_URI}/api/v1/posts?isPublic=true`;

    const posts = await doReq<PageDto<PostWithAuthorDto>>(
      pageOptions.includeQuery(postsEndpoint),
    );

    posts.data.forEach((p) => {
      // @ts-ignore
      p.body = p.body.split('\n');
    });

    return { posts: posts };
  }

  @Get('discover')
  @Render('users/all')
  @UseGuards(OptionalAuthGuard)
  async getUsers(@Headers() headers, @Query() pageOptions: PageOptions) {
    const usersEndpoint = `${process.env.BACKEND_URI}/api/v1/users`;
    const users = await doReq<PageDto<UserDto>>(
      pageOptions.includeQuery(usersEndpoint),
      getRequestOptionsWithCookies(headers),
    );

    return { users: users };
  }

  @Get()
  @Render('posts/new-post')
  @UseGuards(OptionalAuthGuard)
  createNewPost() {
    return { fetchEndpoint: `${process.env.BACKEND_URI}/api/v1/posts` };
  }

  @Get('auth/signin')
  @Render('auth/signin')
  @UseGuards(OptionalAuthGuard)
  async getSignInPage() {
    return { signInEndpoint: `${process.env.BACKEND_URI}/api/v1/auth/signin` };
  }

  @Get('auth/signup')
  @Render('auth/signup')
  @UseGuards(OptionalAuthGuard)
  async getSignUpPage() {
    return { signUpEndpoint: `${process.env.BACKEND_URI}/api/v1/auth/signup` };
  }

  @Get(':username')
  @Render('users/user')
  @UseGuards(OptionalAuthGuard)
  async getUserPage(
    @Session() session,
    @Headers() headers,
    @Query() page: Tab,
    @Param('username') username: string,
    @Query() pageOptions: PageOptions,
  ) {
    let user, posts, followers, following;
    const reqOpts = getRequestOptionsWithCookies(headers);

    let includePrivate = false;
    let curUser: UserWithInfoDto;
    if (session && session.getUserId()) {
      curUser = await doReq<UserDto>(
        `${
          process.env.BACKEND_URI
        }/api/v1/users/supertokens/${session.getUserId()}`,
        reqOpts,
      );

      if (curUser.name === username) {
        includePrivate = true;
      }
    }

    try {
      user = await doReq<UserWithInfoDto>(
        `${process.env.BACKEND_URI}/api/v1/users/${username}?includePrivate=${includePrivate}`,
        reqOpts,
      );
    } catch (err) {
      return { error: err.status };
    }

    switch (page.tab) {
      case ProfileTabs.posts:
        let postsEndpoint = `${process.env.BACKEND_URI}/api/v1/posts?authorId=${user.id}`;
        if (!curUser || (curUser && curUser.id !== user.id)) {
          postsEndpoint += '&isPublic=true';
        }

        posts = await doReq<PageDto<PostWithAuthorDto>>(
          pageOptions.includeQuery(postsEndpoint),
          reqOpts,
        );
        posts.data.forEach((p) => {
          // @ts-ignore
          p.body = p.body.split('\n');
        });
        break;
      case ProfileTabs.followers:
        const followersEndpoint = `${process.env.BACKEND_URI}/api/v1/followers/${user.id}`;
        followers = await doReq<PageDto<UserDto>>(
          pageOptions.includeQuery(followersEndpoint),
          reqOpts,
        );
        break;
      case ProfileTabs.following:
        const followingEndpoint = `${process.env.BACKEND_URI}/api/v1/following/${user.id}`;
        following = await doReq<PageDto<UserDto>>(
          pageOptions.includeQuery(followingEndpoint),
          reqOpts,
        );
        break;
    }

    return {
      user: user,
      posts: posts,
      followers: followers,
      following: following,
    };
  }

  @Get(':username/:postId')
  @Render('posts/single-post')
  @UseGuards(OptionalAuthGuard)
  async getUserPost(
    @Session() session,
    @Headers() headers,
    @Param('username') username: string,
    @Param('postId') postIdStr: string,
    @Query() pageOptions: PageOptions,
  ) {
    if (!parseInt(postIdStr, 10)) {
      return { error: 400 };
    }

    let post;
    const reqOpts = getRequestOptionsWithCookies(headers);
    try {
      post = await doReq<PostWithAuthorDto>(
        `${process.env.BACKEND_URI}/api/v1/posts/${postIdStr}`,
        reqOpts,
      );
      // @ts-ignore
      post.body = post.body.split('\n');
    } catch (err) {
      return { error: err.status };
    }

    let comments;
    pageOptions.reverseOrder();
    try {
      const commentsEndpoint = `${process.env.BACKEND_URI}/api/v1/posts/${postIdStr}/comments`;
      comments = await doReq<PageDto<CommentWithAuthorDto>>(
        pageOptions.includeQuery(commentsEndpoint),
        reqOpts,
      );
    } catch (err) {
      console.log('error getting comments', err);
    }

    return {
      post: post,
      comments: comments,
      deletePostEndpoint: `${process.env.BACKEND_URI}/api/v1/posts/:postId`,
      createCommentEndpoint: `${process.env.BACKEND_URI}/api/v1/comments`,
      backendGatewayURI: `${process.env.BACKEND_URI}`,
    };
  }

  @Get(':username/:postId/edit')
  @Render('posts/edit-post')
  @UseGuards(AuthGuard)
  async editUserPost(
    @Session() session,
    @Headers() headers,
    @Param('username') username: string,
    @Param('postId') postIdStr: string,
  ) {
    if (!parseInt(postIdStr, 10)) {
      return { error: 400 };
    }

    let post;
    const reqOpts = getRequestOptionsWithCookies(headers);
    try {
      post = await doReq<PostWithAuthorDto>(
        `${process.env.BACKEND_URI}/api/v1/posts/${postIdStr}`,
        reqOpts,
      );
    } catch (err) {
      return { error: err.status };
    }

    return {
      post: post,
      updatePostEndpoint: `${process.env.BACKEND_URI}/api/v1/posts/:postId`,
    };
  }
}
