import { ValidationError } from './base.errors';
import { Result } from '@carbonteq/fp';
import { z } from 'zod';

export class PaginationOptionsValidationError extends ValidationError {
  constructor(issues: string) {
    super(`Invalid pagination options: ${issues}`);
  }
}

const DEFAULT_PAGINATION_OPTS = {
  pageNum: 1,
  pageSize: 100,
} as const;

const DISCRIMINANT = Symbol('PaginationOptions');

export class PaginationOptions {
  private static readonly schema = z.object({
    pageNum: z.coerce
      .number()
      .positive()
      .default(DEFAULT_PAGINATION_OPTS.pageNum),
    pageSize: z.coerce
      .number()
      .positive()
      .default(DEFAULT_PAGINATION_OPTS.pageSize),
  });
  private readonly _DISCRIMINATOR = DISCRIMINANT;

  private constructor(readonly pageNum: number, readonly pageSize: number) {}

  /**
   * Validate the passed options to create `PaginationOptions` instance
   * @param options - Pagination Options
   * @param {number} options.pageNum - Page Number (default = 1)
   * @param {number} options.pageSize - Page Size (default = 100)
   * @returns {PaginationOptions} PaginationOptions instance
   */
  static create(
    options: unknown,
  ): Result<PaginationOptions, PaginationOptionsValidationError> {
    const r = PaginationOptions.schema.safeParse(options);

    if (r.success) {
      return Result.Ok(new PaginationOptions(r.data.pageNum, r.data.pageSize));
    } else {
      const err = JSON.stringify(r.error.flatten());
      return Result.Err(new PaginationOptionsValidationError(err));
    }
  }
}

export class Paginated<T> {
  static readonly DEFAULT_PAGINATION_OPTS = DEFAULT_PAGINATION_OPTS;

  private constructor(
    readonly data: T[],
    readonly pageNum: number,
    readonly pageSize: number,
    readonly totalPages: number,
  ) {}

  static fromAll<T>(
    coll: T[],
    { pageNum, pageSize }: PaginationOptions,
  ): Paginated<T> {
    const totalPages = Math.ceil(coll.length / pageSize) || 1;
    const startIdx = (pageNum - 1) * pageSize;
    const collSlice = coll.slice(startIdx, startIdx + pageSize);

    return new Paginated(collSlice, pageNum, pageSize, totalPages);
  }

  /**
   * For cases where the input data has already been sliced according to the pagination options, e.g. using a DB query
   */
  static fromSubset<T>(
    coll: T[],
    { pageSize, pageNum }: PaginationOptions,
    totalElements: number,
  ): Paginated<T> {
    const totalPages = Math.ceil(totalElements / pageSize) || 1; // For empty input
    const collSlice = coll.slice(0, pageSize); // Ensure the size of data <= pageSize, which is a guarantee Paginated<T> provides
    return new Paginated(collSlice, pageNum, pageSize, totalPages);
  }
}
