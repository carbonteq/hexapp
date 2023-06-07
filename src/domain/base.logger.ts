export const LOG_LEVEL = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug',
} as const;

type TLogLevel = typeof LOG_LEVEL;
export type LogLevel = TLogLevel[keyof TLogLevel];

export abstract class Logger {
  static readonly DEFAULT_LEVEL: LogLevel = LOG_LEVEL.INFO;

  abstract error(...args: any[]): void;
  abstract warn(...args: any[]): void;
  abstract debug(...args: any[]): void;
  abstract info(...args: any[]): void;
  abstract log(level: LogLevel, ...args: any[]): void;

  abstract setContext(ctx: string): void;
  abstract setLevel(lvl: LogLevel): void;
}
