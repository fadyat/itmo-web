import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
  NestMiddleware,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { UserDto } from './user/dto/user.dto';
import { NextFunction, Request, Response } from 'express';
import * as url from 'url';
import EmailPassword from 'supertokens-node/recipe/emailpassword';
import { doReq } from './extra/request';

@Injectable()
export class ServerLoadTimeInterceptor implements NestInterceptor {
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const start = Date.now();

    return next.handle().pipe(
      map((data) => ({
        ...data,
        serverLoadTime: Date.now() - start,
      })),
    );
  }
}

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  async intercept(
    ctx: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const req = ctx.switchToHttp().getRequest();

    let me = null;
    if (req.session) {
      const userId = req.session.getUserId();
      me = await doReq<UserDto>(
        `${process.env.BACKEND_URI}/api/v1/users/supertokens/${userId}`,
      );
    }

    return next.handle().pipe(
      map((data) => ({
        ...data,
        me: me,
      })),
    );
  }
}

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly lg = new Logger(LoggerMiddleware.name);

  use(request: Request, response: Response, next: NextFunction) {
    response.on('close', () => {
      this.lg.log(`${request.method} ${request.url} ${response.statusCode}`);
    });

    next();
  }
}

@Injectable()
export class CurrentPageInterceptor implements NestInterceptor {
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<Request>();

    return next.handle().pipe(
      map((data) => ({
        ...data,
        currentPage: request.url,
      })),
    );
  }
}
