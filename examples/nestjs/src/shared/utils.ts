import { BaseDto, DtoResult, AppResult } from '@carbonteq/hexapp';

/**
 * Throws DtoValidationError
 *
 * @throws {DtoValidationError}
 */
export const execService = async <T extends BaseDto, U>(
  dtoRes: DtoResult<T>,
  f: (d: T) => Promise<AppResult<U>>,
): Promise<AppResult<U>> => {
  if (dtoRes.isErr()) {
    const e = dtoRes.unwrapErr();
    throw e;
  }

  return f(dtoRes.unwrap());
};
