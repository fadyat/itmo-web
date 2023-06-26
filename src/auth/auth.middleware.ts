import { Injectable, NestMiddleware, Req, Res } from '@nestjs/common';
import { middleware } from 'supertokens-node/lib/build/framework/express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private readonly supertokensMiddleware: any;

  constructor() {
    this.supertokensMiddleware = middleware();
  }

  async use(@Req() req: any, @Res() res: any, next: () => void) {
    const cookies = req.headers.cookie;
    const accessToken = cookies
      ?.split(';')
      .find((c) => c.includes('sAccessToken'));

    const refreshToken = cookies
      ?.split(';')
      .find((c) => c.includes('sIdRefreshToken'));

    if (!accessToken && refreshToken) {
      // TODO: get new access token
      res.clearCookie('sIdRefreshToken');
      res.redirect('/auth/signin');
    }

    this.supertokensMiddleware(req, res, next);
  }
}
