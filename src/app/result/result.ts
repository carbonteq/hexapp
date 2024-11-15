import { Result, type UNIT } from "@carbonteq/fp";
import { AppError } from "./error.js";

type InnerResult<T> = Result<T, AppError>;

export type EmptyResult = typeof AppResult.EMPTY;

export class AppResult<T> {
  readonly _isOk: boolean;

  static readonly EMPTY: AppResult<UNIT> = new AppResult(Result.UNIT_RESULT);

  private constructor(private readonly inner_result: InnerResult<T>) {
    this._isOk = inner_result.isOk();
  }

  isOk(): this is AppResult<T> {
    return this.inner_result.isOk();
  }

  isErr(): this is AppResult<never> {
    return this.inner_result.isErr();
  }

  static Ok<T>(val: T): AppResult<T> {
    return new AppResult(Result.Ok(val));
  }

  static Err(err: Error): AppResult<never> {
    const e = AppError.fromErr(err);

    return new AppResult<never>(Result.Err(e));
  }

  static fromResult<T, E extends Error>(result: Result<T, E>): AppResult<T> {
    const r = result.mapErr((e) => AppError.fromErr(e));

    return new AppResult(r);
  }

  toResult(): Result<T, AppError> {
    return this.inner_result;
  }

  and<U>(other: AppResult<U>): AppResult<readonly [T, U]> {
    return new AppResult(this.inner_result.and(other.inner_result));
  }

  tap(f: (val: T) => void): AppResult<T> {
    this.inner_result.tap(f);

    return this;
  }

  async tapAsync(f: (val: T) => Promise<void>): Promise<AppResult<T>> {
    await this.inner_result.tapAsync(f);

    return this;
  }

  static fromOther<T>(result: AppResult<T>): AppResult<T> {
    return new AppResult(result.inner_result);
  }

  zip<U>(fn: (r: T) => U): AppResult<[T, U]> {
    return new AppResult(this.inner_result.zip(fn));
  }

  flatZip<U>(f: (r: T) => Result<U, AppError>): AppResult<[T, U]> {
    return new AppResult(this.inner_result.flatZip(f));
  }

  flatMap<U>(f: (r: T) => Result<U, AppError>): AppResult<U> {
    return new AppResult(this.inner_result.flatMap(f));
  }

  unwrap(): T {
    return this.inner_result.unwrap();
  }

  unwrapErr(): AppError {
    return this.inner_result.unwrapErr();
  }

  unwrapOr(def: T): T {
    return this.inner_result.unwrapOr(def);
  }

  unwrapOrElse(fn: () => T): T;
  unwrapOrElse(fn: () => Promise<T>): Promise<T>;
  unwrapOrElse(fn: () => T | Promise<T>): T | Promise<T> {
    return this.inner_result.unwrapOrElse(fn as () => T); // type patch
  }

  map<U>(fn: (val: T) => U): AppResult<U> {
    const newResult = this.inner_result.map(fn);

    return new AppResult(newResult);
  }

  mapErr(fn: (err: AppError) => AppError): AppResult<T> {
    return new AppResult(this.inner_result.mapErr(fn));
  }

  safeUnwrap(): T | null {
    return this.inner_result.safeUnwrap();
  }
}
