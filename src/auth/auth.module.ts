import {
  DynamicModule,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { AuthModuleConfig, ConfigInjectionToken } from './auth.config';
import { SupertokensService } from './supertokens.service';
import { AuthMiddleware } from './auth.middleware';

@Module({})
export class AuthModule implements NestModule {
  static forRoot({
    connectionUri,
    apiKey,
    appInfo,
  }: AuthModuleConfig): DynamicModule {
    return {
      module: AuthModule,
      providers: [
        {
          useValue: { connectionUri, apiKey, appInfo },
          provide: ConfigInjectionToken,
        },
        SupertokensService,
      ],
    };
  }

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
