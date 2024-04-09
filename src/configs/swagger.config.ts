import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as basicAuth from 'express-basic-auth';
import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { appConfig } from './app.config';
import { libConfig } from '../nest/config/lib.config';

export function initSwagger(server: INestApplication) {
  // Init api swagger if neither 'production' environment
  if (!appConfig.isProduction) {
    if (!appConfig.isLocal) {
      server.use(
        [`/${appConfig.serviceName}/docs`, `/${appConfig.serviceName}/docs-json`],
        basicAuth({
          challenge: true,
          users: {
            [libConfig.swaggerConfig.user]: libConfig.swaggerConfig.password,
          },
        }),
      );
    }

    const apiDocOptions = new DocumentBuilder()
      .setTitle(`[${appConfig.nodeEnv.toUpperCase()}] ${appConfig.appName} API`)
      .setDescription(`The ${appConfig.appName} API documentation`)
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(server, apiDocOptions, {
      operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
    });

    SwaggerModule.setup(`${appConfig.serviceName}/docs`, server, document);
  }
}

export function getListResponseSchema(itemSchema: SchemaObject) {
  const schema: SchemaObject = {
    type: 'object',
    properties: {
      data: {
        type: 'array',
        items: itemSchema,
      },
      page: { type: 'number' },
      pageSize: { type: 'number' },
      totalPage: { type: 'number' },
      totalItem: { type: 'number' },
    },
  };

  return schema;
}
