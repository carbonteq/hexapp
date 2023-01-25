import {
  assertUnreachablePassthrough,
  Logger,
  LogLevel,
  LOG_LEVEL,
} from '@carbonteq/hexapp';
import { Injectable, Provider, Scope, LoggerService } from '@nestjs/common';
import pino, { Logger as PinoBaseLogger } from 'pino';

export const transportOpts = {
  target: 'pino-pretty',
  options: {
    colorize: true,
    levelFirst: true,
    translateTime: 'yyyy-dd-mm, h:MM:ss TT',
    singleLine: true,
    ignore: 'hostname,pid',
    messageFormat: '[{context}] {msg}',
  },
};

const createPinoLogger = (
  context: string,
  logLevel: LogLevel,
): PinoBaseLogger => {
  const logger = pino({
    level: logLevel,
    transport: {
      ...transportOpts,
    },
    // name: context,
  });

  logger.setBindings({ context });

  return logger;
};

@Injectable({ scope: Scope.TRANSIENT })
export class PinoAppLogger implements Logger, LoggerService {
  private logger: PinoBaseLogger;
  private context: string;

  static readonly DEFAULT_LOG_LEVEL: LogLevel = LOG_LEVEL.DEBUG;
  static readonly DEFAULT_CTX: string = 'default';

  constructor() {
    this.context = PinoAppLogger.DEFAULT_CTX;
    this.logger = createPinoLogger(
      this.context,
      PinoAppLogger.DEFAULT_LOG_LEVEL,
    );
  }

  setContext(ctx: string): void {
    this.context = ctx;
    this.logger.setBindings({ context: this.context });
  }

  // will be updated later
  setLevel(level: LogLevel): void {
    this.logger = createPinoLogger(this.context, level);
  }

  debug(...data: any[]): void {
    this.logger.debug(data);
  }

  info(...data: any[]): void {
    this.logger.info(data);
  }

  warn(...data: any[]): void {
    this.logger.warn(data);
  }

  error(...data: any[]): void {
    this.logger.error(data);
  }

  log(level: LogLevel, ...args: any[]): void {
    switch (level) {
      case LOG_LEVEL.ERROR:
        this.info(...args);
        break;
      case LOG_LEVEL.WARN:
        this.warn(...args);
        break;
      case LOG_LEVEL.INFO:
        this.info(...args);
        break;
      case LOG_LEVEL.DEBUG:
        this.debug(...args);
        break;
      default:
        assertUnreachablePassthrough(level);
    }
  }
}

export const AppLoggerProvider: Provider<Logger> = {
  provide: Logger,
  useClass: PinoAppLogger,
};
