export enum LogLevel {
  INFO = 'info',
  DEBUG = 'debug',
  WARN = 'warn',
  ERROR = 'error',
}

export abstract class Logger {
  static readonly DEFAULT_LEVEL: LogLevel = LogLevel.INFO;

  abstract error(...args: any[]): void;
  abstract warn(...args: any[]): void;
  abstract debug(...args: any[]): void;
  abstract info(...args: any[]): void;

  abstract setContext(ctx: string): void;
  abstract setLevel(lvl: LogLevel): void;
}
