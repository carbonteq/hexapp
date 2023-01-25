import { Global, Module } from '@nestjs/common';
import {
  AppLoggerProvider,
  PinoAppLogger,
  transportOpts,
} from '@infra/logger/pino.logger';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';

@Global()
@Module({
  imports: [
    PinoLoggerModule.forRoot({
      pinoHttp: {
        transport: {
          ...transportOpts,
        },
      },
    }),
  ],
  providers: [AppLoggerProvider, PinoAppLogger],
  exports: [AppLoggerProvider],
})
export class AppLoggerModule { }

export { PinoAppLogger } from './pino.logger';
