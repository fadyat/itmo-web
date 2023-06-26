import { Inject, Injectable } from '@nestjs/common';
import { AuthModuleConfig, ConfigInjectionToken } from './auth.config';
import supertokens from 'supertokens-node';
import Session from 'supertokens-node/recipe/session';
import EmailPassword from 'supertokens-node/recipe/emailpassword';

@Injectable()
export class SupertokensService {
  constructor(
    @Inject(ConfigInjectionToken) private readonly cfg: AuthModuleConfig,
  ) {
    supertokens.init({
      appInfo: cfg.appInfo,
      supertokens: {
        connectionURI: cfg.connectionUri,
        apiKey: cfg.apiKey,
      },
      recipeList: [
        EmailPassword.init(),
        Session.init({
          jwt: { enable: true },
        }),
      ],
    });
  }
}
