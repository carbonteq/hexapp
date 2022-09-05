import { Err, Ok, Result } from 'oxide.ts';

export enum AppResultError {
  Unknown,
  NotFound,
  Unauthorized,
  InvalidData,
}

interface AppResultInitParams<T> {
  val: T | null;
  err: AppResultError | null;
  isOk: boolean;
  result?: Result<T, AppResultError>;
}

export class AppResult<T> {
  // private readonly val: AppResultInitParams<T>['val'];
  // private readonly err: AppResultInitParams<T>['err'];

  readonly isOk: AppResultInitParams<T>['isOk'];
  private readonly result: Result<T, AppResultError>;

  private constructor({ val, err, isOk, result }: AppResultInitParams<T>) {
    if (result !== undefined) {
      this.result = result;
      this.isOk = result.isOk();
      return;
    }

    // this.val = val;
    // this.err = err;
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

  unwrap(): T {
    return this.result.unwrap();
  }

  unwrapOr(def: T): T {
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
