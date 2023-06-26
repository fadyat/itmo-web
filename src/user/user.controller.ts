import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  ApiBadRequestResponse,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UserDto } from './dto/user.dto';
import { PageDto } from '../extra/pagination/page.dto';
import { UserWithInfoDto } from './dto/user-with-info.dto';
import { UserSubscriptionDto } from './dto/user.subscription.dto';
import { ResponseError } from '../extra/error-response';
import { SuccessResponse } from '../extra/success-response';
import { PageOptions } from '../extra/pagination/options';
import { ApiPaginatedResponse } from '../extra/pagination/decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard, OptionalAuthGuard } from '../auth/auth.guard';
import { Session } from '../auth/session.decorator';
import { UserFilterDto } from './dto/user-filter.dto';

@Controller('/api/v1')
@ApiTags('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('users')
  @ApiOkResponse({ type: SuccessResponse })
  @ApiBadRequestResponse({ type: ResponseError })
  @ApiInternalServerErrorResponse({ type: ResponseError })
  async createUser(@Body() userDto: CreateUserDto) {
    await this.userService.createUser(userDto);
    return new SuccessResponse('ok');
  }

  @Get('users')
  @UseGuards(OptionalAuthGuard)
  @ApiPaginatedResponse(UserDto)
  @ApiBadRequestResponse({ type: ResponseError })
  @ApiInternalServerErrorResponse({ type: ResponseError })
  async getUsers(
    @Session() session,
    @Query() pageOptionsDto: PageOptions,
  ): Promise<PageDto<UserDto>> {
    const supertokensUserId = session?.getUserId();
    return await this.userService.getUsers(pageOptionsDto, supertokensUserId);
  }

  @Get('followers/:id')
  @UseGuards(OptionalAuthGuard)
  @ApiPaginatedResponse(UserDto)
  @ApiBadRequestResponse({ type: ResponseError })
  @ApiNotFoundResponse({ type: ResponseError })
  @ApiInternalServerErrorResponse({ type: ResponseError })
  async getUserFollowers(
    @Session() session,
    @Param('id', ParseIntPipe) id: number,
    @Query() pageOptions: PageOptions,
  ): Promise<PageDto<UserDto>> {
    const supertokensUserId = session?.getUserId();
    return await this.userService.getUserFollowers(
      id,
      pageOptions,
      supertokensUserId,
    );
  }

  @Get('following/:id')
  @UseGuards(OptionalAuthGuard)
  @ApiPaginatedResponse(UserDto)
  @ApiBadRequestResponse({ type: ResponseError })
  @ApiNotFoundResponse({ type: ResponseError })
  @ApiInternalServerErrorResponse({ type: ResponseError })
  async getUserFollowing(
    @Session() session,
    @Param('id', ParseIntPipe) id: number,
    @Query() pageOptions: PageOptions,
  ): Promise<PageDto<UserDto>> {
    const supertokensUserId = session?.getUserId();
    return await this.userService.getUserFollowing(
      id,
      pageOptions,
      supertokensUserId,
    );
  }

  @Get('users/:username')
  @UseGuards(OptionalAuthGuard)
  @ApiOkResponse({ type: UserWithInfoDto })
  @ApiBadRequestResponse({ type: ResponseError })
  @ApiForbiddenResponse({ type: ResponseError })
  @ApiNotFoundResponse({ type: ResponseError })
  @ApiInternalServerErrorResponse({ type: ResponseError })
  async getUserByUsername(
    @Session() session,
    @Query() userFilterDto: UserFilterDto,
    @Param('username') username: string,
  ): Promise<UserWithInfoDto> {
    if (!session && userFilterDto.includePrivate === 'true') {
      throw new ForbiddenException(
        "can't include private posts in count if not logged in",
      );
    }

    if (userFilterDto.includePrivate === 'true') {
      const curUser = await this.userService.getUserBySupertokensId(
        session.getUserId(),
      );

      if (curUser.name !== username) {
        throw new ForbiddenException(
          "can't include not your own private posts in count",
        );
      }
    }

    return await this.userService.getUserByUsername(username, userFilterDto);
  }

  @Get('users/supertokens/:id')
  async getUserBySupertokensId(
    @Param('id') supertokensId: string,
  ): Promise<UserDto> {
    return await this.userService.getUserBySupertokensId(supertokensId);
  }

  @Post('users/:id/follow')
  @UseGuards(AuthGuard)
  @ApiCookieAuth()
  @ApiCreatedResponse({ type: SuccessResponse })
  @ApiBadRequestResponse({ type: ResponseError })
  @ApiUnauthorizedResponse({ type: ResponseError })
  @ApiNotFoundResponse({ type: ResponseError })
  @ApiInternalServerErrorResponse({ type: ResponseError })
  async follow(
    @Session() session,
    @Param('id', ParseIntPipe) targetId: number,
  ): Promise<SuccessResponse> {
    const curUser = await this.userService.getUserBySupertokensId(
      session?.getUserId(),
    );

    await this.userService.follow({ sourceId: curUser.id, targetId });
    return new SuccessResponse('ok');
  }

  @Delete('users/:id/unfollow')
  @UseGuards(AuthGuard)
  @ApiCookieAuth()
  @ApiOkResponse({ type: SuccessResponse })
  @ApiBadRequestResponse({ type: ResponseError })
  @ApiUnauthorizedResponse({ type: ResponseError })
  @ApiNotFoundResponse({ type: ResponseError })
  @ApiInternalServerErrorResponse({ type: ResponseError })
  async unfollow(
    @Session() session,
    @Param('id', ParseIntPipe) targetId: number,
  ): Promise<SuccessResponse> {
    const curUser = await this.userService.getUserBySupertokensId(
      session?.getUserId(),
    );

    await this.userService.unfollow({ sourceId: curUser.id, targetId });
    return new SuccessResponse('ok');
  }
}
