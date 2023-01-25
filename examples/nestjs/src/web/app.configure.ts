import { INestApplication } from '@nestjs/common';
import { AppResultTransformer, ErrorsInterceptor } from '@web/utils';
import { NestFactory } from '@nestjs/core';
import { WebModule } from '@web/web.module';
import { Logger as PinoLogger } from 'nestjs-pino';
import { PinoAppLogger } from '@infra/logger';

export const createApp = async (): Promise<INestApplication> => {
  return NestFactory.create(WebModule, {
    bufferLogs: true,
    logger: ['debug', 'warn', 'log', 'error', 'verbose'],
  });
};

const configureApp = (app: INestApplication) => {
  // app.enableCors({ origin: '*' });

  const logger = app.get(PinoLogger);

  app.useLogger(logger);
  app.useGlobalInterceptors(
    new AppResultTransformer(new PinoAppLogger()),
    new ErrorsInterceptor(new PinoAppLogger()),
  );
};

export const configureAppForTest = (app: INestApplication) => {
  configureApp(app);
};

export const configureAppForDevProd = (app: INestApplication) => {
  configureApp(app);
};
