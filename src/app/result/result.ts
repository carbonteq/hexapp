import { Err, Ok, Result } from 'oxide.ts';
import {
	DomainError,
	InvalidOperation,
	NotFoundError,
	UnauthorizedOperation,
	ValidationError,
	AlreadyExistsError,
} from '@carbonteq/hexapp/domain/base.exception';
import { AppError } from './error';

type InnerResult<T> = Result<T, AppError>;

// interface AppResultInitParams<T> {
// 	val: T | null;
// 	err: AppResultError | null;
// 	isOk: boolean;
// 	result?: Result<T, AppResultError>;
// }

type ErrTransformer = (err: Error) => AppError;
const DefaultMapErrOp: ErrTransformer = (err: Error) => {
	if (!(err instanceof DomainError)) {
		throw err;
	}

	if (err instanceof NotFoundError) {
		return AppError.NotFound(err.message);
	}
	if (err instanceof ValidationError) {
		return AppError.InvalidData(err.message);
	}
	if (err instanceof InvalidOperation) {
		return AppError.InvalidOperation(err.message);
	}
	if (err instanceof UnauthorizedOperation) {
		return AppError.Unauthorized(err.message);
	}
	if (err instanceof AlreadyExistsError) {
		return AppError.AlreadyExists(err.message);
	}

	return AppError.Unknown(err.message);
};

export class AppResult<T> {
	readonly isOk: boolean;

	private constructor(private readonly result: InnerResult<T>) {
		this.result = result;
		this.isOk = result.isOk();

		// this.isOk = isOk;
		//
		// if (isOk) {
		// 	if (val === null) {
		// 		throw new Error('val must not be null for a successful AppResult');
		// 	}
		// 	this.result = Ok(val);
		// } else {
		// 	if (err === null) {
		// 		throw new Error('err must not be null for a failed AppResult');
		// 	}
		// 	this.result = Err(err);
		// }
	}

	static Ok<T>(val: T): AppResult<T> {
		return new AppResult(Ok(val));
	}

	static Err(err: AppError): AppResult<never> {
		return new AppResult<never>(Err(err));
	}

	static fromResult<T>(result: InnerResult<T>): AppResult<T> {
		return new AppResult(result);
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
		// have to add conditional so that the right type of error is thrown
		if (this.result.isOk()) {
			return this.result.unwrap();
		} else {
			throw this.result.unwrapErr();
		}
	}

	unwrapOr(def: T): T {
		return this.result.unwrapOr(def);
	}

	unwrapErr(): AppError {
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
