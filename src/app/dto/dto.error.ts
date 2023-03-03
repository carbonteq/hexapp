import type { ZodError } from 'zod';

export const prettifyZodError = (err: ZodError): string => {
  const issues = err.issues.map((i) => `'${i.path[0]}' -> ${i.message}`);

  return `[${issues.join(',')}]`;
};

export class DtoValidationError extends Error {
  constructor(msg: string, err?: Error) {
    super();

    this.name = 'DTOValidationError';
    this.message = msg;
    if (err) {
      this.stack = err.stack;
    }
  }

  static fromZodError(err: ZodError): DtoValidationError {
    const prettyErrMsg = prettifyZodError(err);

    return new DtoValidationError(prettyErrMsg, err);
  }
}
