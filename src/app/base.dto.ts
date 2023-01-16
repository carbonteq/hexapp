import { Ok, Err, Result } from 'oxide.ts';
import { z, ZodError } from 'zod';

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

export abstract class BaseDto {
  protected constructor() { }

  protected static validate<T>(
    schema: z.Schema<T>,
    data: any,
  ): Result<T, DtoValidationError> {
    try {
      const validatedData = schema.parse(data);

      return Ok(validatedData);
    } catch (err) {
      if (err instanceof ZodError) {
        return Err(DtoValidationError.fromZodError(err));
      }

      throw err;
    }
  }
}
