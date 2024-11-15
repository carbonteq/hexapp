export const LOG_LEVEL = {
  ERROR: "error",
  WARN: "warn",
  INFO: "info",
  DEBUG: "debug",
} as const;

type TLogLevel = typeof LOG_LEVEL;
export type LogLevel = TLogLevel[keyof TLogLevel];

export abstract class Logger {
  static readonly DEFAULT_LEVEL: LogLevel = LOG_LEVEL.INFO;

  abstract error(...args: unknown[]): void;
  abstract warn(...args: unknown[]): void;
  abstract debug(...args: unknown[]): void;
  abstract info(...args: unknown[]): void;
  abstract log(level: LogLevel, ...args: unknown[]): void;

  abstract setContext(ctx: string): void;
  abstract setLevel(lvl: LogLevel): void;
}
