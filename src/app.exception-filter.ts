import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { ErrorRequestHandler, NextFunction, Response } from 'express';
import {
  CannotCreateEntityIdMapError,
  EntityNotFoundError,
  QueryFailedError,
  TypeORMError,
} from 'typeorm';
import { Error as SupertokensError } from 'supertokens-node';
import { errorHandler as superTokensErrorHandler } from 'supertokens-node/lib/build/framework/express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const statusCode = exception.getStatus();

    host.switchToHttp().getResponse<Response>().status(statusCode).json({
      statusCode: statusCode,
      error: exception.message,
      timestamp: new Date().toISOString(),
    });
  }
}

@Catch(TypeORMError)
export class TypeOrmExceptionFilter implements ExceptionFilter {
  catch(exception: TypeORMError, host: ArgumentsHost): any {
    let statusCode = 500;

    if (exception instanceof EntityNotFoundError) {
      statusCode = 404;
    } else if (exception instanceof CannotCreateEntityIdMapError) {
      statusCode = 400;
    } else if (exception instanceof QueryFailedError) {
      statusCode = 400;
    }

    host.switchToHttp().getResponse<Response>().status(statusCode).json({
      statusCode: statusCode,
      error: exception.message,
      timestamp: new Date().toISOString(),
    });
  }
}

@Catch(SupertokensError)
export class SupertokensExceptionFilter implements ExceptionFilter {
  private readonly handler: ErrorRequestHandler;

  constructor() {
    this.handler = superTokensErrorHandler();
  }

  catch(exception: typeof SupertokensError, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();

    const res = ctx.getResponse<Response>();
    if (res.headersSent) {
      return;
    }

    this.handler(exception, ctx.getRequest(), res, ctx.getNext<NextFunction>());
  }
}
