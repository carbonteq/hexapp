import { Err, Ok, Result } from 'oxide.ts';
import {
  DomainError,
  InvalidOperation,
  NotFoundError,
  UnauthorizedOperation,
  ValidationError,
  AlreadyExistsError,
} from '@carbonteq/hexapp/domain/base.exception';
import { AppResultError } from './error';

interface AppResultInitParams<T> {
  val: T | null;
  err: AppResultError | null;
  isOk: boolean;
  result?: Result<T, AppResultError>;
}

type ErrTransformer = (err: Error) => AppResultError;
const DefaultMapErrOp: ErrTransformer = (err: Error) => {
  if (!(err instanceof DomainError)) throw err;

  if (err instanceof NotFoundError) return AppResultError.NotFound(err.message);
  if (err instanceof ValidationError)
    return AppResultError.InvalidData(err.message);
  if (err instanceof InvalidOperation)
    return AppResultError.InvalidOperation(err.message);
  if (err instanceof UnauthorizedOperation)
    return AppResultError.Unauthorized(err.message);
  if (err instanceof AlreadyExistsError)
    return AppResultError.AlreadyExists(err.message);

  return AppResultError.Unknown(err.message);
};

export class AppResult<T> {
  readonly isOk: AppResultInitParams<T>['isOk'];
  private readonly result: Result<T, AppResultError>;

  private constructor({ val, err, isOk, result }: AppResultInitParams<T>) {
    if (result !== undefined) {
      this.result = result;
      this.isOk = result.isOk();
      return;
    }

    this.isOk = isOk;

    if (isOk) {
      if (val === null) {
        throw new Error('val must not be null for a successful AppResult');
      }
      this.result = Ok(val);
    } else {
      if (err === null) {
        throw new Error('err must not be null for a failed AppResult');
      }
      this.result = Err(err);
    }
  }

  static Ok<T>(val: T): AppResult<T> {
    return new AppResult({ val, isOk: true, err: null });
  }

  static Err(err: AppResultError): AppResult<never> {
    return new AppResult<never>({ val: null, err, isOk: false });
  }

  static fromResult<T>(result: Result<T, AppResultError>): AppResult<T> {
    return new AppResult({ val: null, err: null, isOk: false, result });
  }

  static tryFrom<T>(
    fn: () => T extends PromiseLike<any> ? never : T,
    errTransformer?: ErrTransformer,
  ): AppResult<T> {
    const errMapper = errTransformer ?? DefaultMapErrOp;
    // const result = Result.safe(fn).mapErr(errMapper);

    try {
      const val = fn();
      return AppResult.Ok(val);
    } catch (err) {
      return AppResult.Err(errMapper(err as Error));
    }

    // return AppResult.fromResult(result);
  }

  static tryFromPromise<T>(
    promise: Promise<T>,
    errTransformer?: ErrTransformer,
  ): Promise<AppResult<T>> {
    const errMapper = errTransformer ?? DefaultMapErrOp;

    return promise
      .then((val) => AppResult.fromResult(Ok(val)))
      .catch((err) => {
        const mappedErr = errMapper(err);
        const res = Err(mappedErr);
        return AppResult.fromResult(res);
      });

    // return Result.safe(promise)
    //   .then((res) => AppResult.fromResult(res.mapErr(errMapper)))
    //   .catch((err) => AppResult.Err(AppResultError.Unknown));
  }

  unwrap(): T {
    return this.result.unwrap();
  }

  unwrapOr(def: T): T {
    this.result.mapErr;
    return this.result.unwrapOr(def);
  }

  unwrapErr(): AppResultError {
    return this.result.unwrapErr();
  }

  unwrapOrElse(fn: () => T): T {
    return this.result.unwrapOrElse(fn);
  }

  map<U>(fn: (val: T) => U): AppResult<U> {
    const newResult = this.result.map(fn);

    return AppResult.fromResult(newResult);
  }

  into(): T | undefined {
    return this.result.into();
  }
}
