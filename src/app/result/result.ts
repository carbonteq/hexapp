import { AppError } from './error';
import { Result, TUnit } from '@carbonteq/fp';

type InnerResult<T> = Result<T, AppError>;

// type ErrTransformer = (err: Error) => AppError;
// const DefaultMapErrOp: ErrTransformer = (err: Error) => {
// 	return AppError.fromErr(err);
// };

export type EmptyResult = typeof AppResult.EMPTY;

  /**
 * AppResult is a monad that provides a clean way to return an object or error from your application layer.
 *
 * @template T - The type of the successful result.
 */
export class AppResult<T> {
  readonly _isOk: boolean;

  static readonly EMPTY: AppResult<TUnit> = new AppResult(Result.UNIT_RESULT);

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

  /**
 * Converts the Result monad into an AppResult.
 *
 * @template T - The type of the successful result.
 * @template E - The type of the error.
 * @param {Result<T, E>} result - The Result object to convert.
 * @returns {AppResult<T>} - An AppResult object containing the transformed result.
 *
 * @example
 * const person: Result<PersonModel, Error> = findPersonById(23);
 * return AppResult.fromResult(person);
 */
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

  do(f: (val: T) => void): AppResult<T> {
    this.inner_result.do(f);

    return this;
  }

  async doAsync(f: (val: T) => Promise<void>): Promise<AppResult<T>> {
    await this.inner_result.doAsync(f);

    return this;
  }

  static fromOther<T>(result: AppResult<T>): AppResult<T> {
    return new AppResult(result.inner_result);
  }

  zipF<U>(f: (r: T) => Result<U, AppError>): AppResult<[T, U]> {
    return new AppResult(this.inner_result.zipF(f));
  }

  async zipFAsync<U>(
    f: (r: T) => Promise<Result<U, AppError>>,
  ): Promise<AppResult<[T, U]>> {
    return this.inner_result.zipFAsync(f).then((r) => new AppResult(r));
  }

  bind<U>(f: (r: T) => Result<U, AppError>): AppResult<U> {
    return new AppResult(this.inner_result.bind(f));
  }

  async bindAsync<U>(
    f: (r: T) => Promise<Result<U, AppError>>,
  ): Promise<AppResult<U>> {
    return this.inner_result.bind(f).then((r) => new AppResult(r));
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

// export const toAppResult = <TRet>(
// 	_target: any,
// 	_propertyKey: string,
// 	descriptor: TypedPropertyDescriptor<(...args: any[]) => TRet>,
// ) => {
// 	const original = descriptor.value;
//
// 	if (original) {
// 		// @ts-ignore
// 		descriptor.value = function (...args: any[]) {
// 			try {
// 				const r = original.call(this, ...args);
//
// 				return AppResult.Ok(r);
// 			} catch (err) {
// 				const e = AppError.fromErr(err as Error);
// 				return AppResult.Err(e);
// 			}
// 		};
// 	}
// };
