import 'dotenv/config';
import { join } from 'path';
import { NestFactory } from '@nestjs/core';
import { BadRequestException, HttpStatus, ValidationPipe } from '@nestjs/common';
import { json } from 'express';
import * as compression from 'compression';
import helmet from 'helmet';
import * as morgan from 'morgan';
import { middleware as expressCtx } from 'express-ctx';
import { AppConst } from './commons/consts/app.const';
import { initSwagger } from './configs/swagger.config';
import { AppModule } from './modules/app/app.module';
import { appConfig } from './configs/app.config';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const server = await NestFactory.create<NestExpressApplication>(AppModule);

  server.use(json({ limit: '100mb' }));
  server.enableCors();
  server.setGlobalPrefix(
    `/${appConfig.serviceName}/${AppConst.API_PREFIX}/${AppConst.API_VERSION}`,
  );

  initSwagger(server);

  server.useStaticAssets(join(__dirname, 'public'));

  server.use(helmet());
  server.use(compression());
  server.use(
    morgan(appConfig.isLocal ? 'dev' : 'tiny', {
      skip: function (req) {
        return req.url.endsWith('health/app');
      },
    }),
  );

  // Auto validation DTO at application level
  server.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      errorHttpStatusCode: HttpStatus.BAD_REQUEST,
      transform: true,
      // dismissDefaultMessages: true,
      exceptionFactory: (errors) => new BadRequestException(errors),
    }),
  );

  server.use(expressCtx);

  // Start server
  await server.listen(appConfig.port, () => {
    console.log(`Server's running at port ${appConfig.port}`);
  });
}
bootstrap();
