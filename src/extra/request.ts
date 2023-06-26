import { ResponseError } from './error-response';
import { HttpException } from '@nestjs/common';

export async function doReq<TResponse>(
  url: string,
  config: RequestInit = {},
): Promise<TResponse> {
  const jsonEntity = await fetch(url, config).then((r) => r.json());

  if (jsonEntity['error']) {
    const errorEntity = jsonEntity as ResponseError;
    throw new HttpException(errorEntity.error, errorEntity.statusCode);
  }

  return jsonEntity as TResponse;
}

export function getRequestOptionsWithCookies(
  headers: Record<string, string> = {},
): RequestInit {
  const reqOpts: RequestInit = {
    credentials: 'include',
    mode: 'same-origin',
  };

  if (headers.cookie) {
    reqOpts['headers'] = {
      cookie: headers.cookie,
    };
  }

  return reqOpts;
}
