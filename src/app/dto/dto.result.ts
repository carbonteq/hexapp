import { Ok, Err, Result } from 'oxide.ts';
import type { ZodError } from 'zod';

import { DtoValidationError } from './dto.error';

export class DtoValidationResult<T> {
  private inner_result: Result<T, DtoValidationError>;

  private constructor(result: Result<T, DtoValidationError>) {
    this.inner_result = result;
  }

  /**
   * Throws DtoValidationError
   *
   * @throws {DtoValidationError}
   */
  unwrap(): T {
    if (this.inner_result.isOk()) {
      return this.inner_result.unwrap();
    } else {
      const e = this.inner_result.unwrapErr();
      throw e;
    }
  }

  unwrapErr(): DtoValidationError {
    return this.inner_result.unwrapErr();
  }

  map<U>(f: (val: T) => U): DtoValidationResult<U> {
    const res = this.inner_result.map(f);

    return new DtoValidationResult(res);
  }

  isOk(): this is DtoValidationResult<T> {
    return this.inner_result.isOk();
  }

  isErr(): this is DtoValidationResult<never> {
    return this.inner_result.isErr();
  }

  static fromVal<X>(val: X): DtoValidationResult<X> {
    return new DtoValidationResult(Ok(val));
  }

  static fromZodError(err: ZodError): DtoValidationResult<never> {
    const e = Err(DtoValidationError.fromZodError(err));
    return new DtoValidationResult(e);
  }
}
