import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as hbs from 'hbs';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import {
  HttpExceptionFilter,
  SupertokensExceptionFilter,
  TypeOrmExceptionFilter,
} from './app.exception-filter';
import * as url from 'url';
import supertokens from 'supertokens-node';

function setupSwagger(app: INestApplication) {
  const opts = new DocumentBuilder()
    .setTitle('gists')
    .setDescription('The gists API description')
    .setVersion('1.0')
    .addCookieAuth()
    .build();

  const doc = SwaggerModule.createDocument(app, opts);
  SwaggerModule.setup('swagger', app, doc);
}

function setupHelpers() {
  hbs.registerHelper('dateFormat', require('handlebars-dateformat'));

  hbs.registerHelper('inc', function (number, _) {
    return parseInt(number) + 1;
  });

  hbs.registerHelper('dec', function (number, _) {
    return parseInt(number) - 1;
  });

  hbs.registerHelper('ifeq', function (a, b, opts) {
    if (a == b) {
      return opts.fn(this);
    }

    return opts.inverse(this);
  });

  /*
   <key>="omit" -- will skip this parameter
   omitAll=<...> -- will skip all query
   */
  hbs.registerHelper('querify', function (args) {
    const parsed = url.parse(args.hash.currentPage);
    const prevQuery = new URLSearchParams(parsed.query);
    const newQuery = new URLSearchParams(args.hash);
    newQuery.delete('currentPage');

    if (newQuery.has('omitAll')) {
      return parsed.pathname;
    }

    newQuery.forEach((v, k) => {
      if (v == 'omit') {
        prevQuery.delete(k);
      } else {
        prevQuery.set(k, v);
      }
    });

    return `${parsed.pathname}?${prevQuery.toString()}`;
  });
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const cfgService = app.get(ConfigService);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(
    new HttpExceptionFilter(),
    new TypeOrmExceptionFilter(),
    new SupertokensExceptionFilter(),
  );
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');
  hbs.registerPartials(join(__dirname, '..', 'views', 'partials'));
  app.enableCors({
    origin: [process.env.BACKEND_URI],
    allowedHeaders: ['content-type', ...supertokens.getAllCORSHeaders()],
    credentials: true,
  });

  setupSwagger(app);
  setupHelpers();

  await app.listen(cfgService.get('PORT'));
}

bootstrap().then((_) => {
  console.log('Application started!');
});
