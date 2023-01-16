import { Unit } from '@carbonteq/hexapp/shared';
import { Err, Ok, Result } from 'oxide.ts';
import { AppError } from './error';

type InnerResult<T> = Result<T, AppError>;

type ErrTransformer = (err: Error) => AppError;
const DefaultMapErrOp: ErrTransformer = (err: Error) => {
	return AppError.fromErr(err);
};

export class AppResult<T> {
	readonly isOk: boolean;

	static readonly Unit: AppResult<Unit> = AppResult.Ok({});

	private constructor(private readonly inner_result: InnerResult<T>) {
		this.isOk = inner_result.isOk();
	}

	static Ok<T>(val: T): AppResult<T> {
		return new AppResult(Ok(val));
	}

	static Err(err: AppError): AppResult<never> {
		return new AppResult<never>(Err(err));
	}

	static fromResult<T, E extends Error>(result: Result<T, E>): AppResult<T> {
		const r = result.mapErr((e) => AppError.fromErr(e));

		return new AppResult(r);
	}

	static fromOther<T>(result: AppResult<T>): AppResult<T> {
		return new AppResult(result.inner_result);
	}

	static tryFrom<T>(
		fn: () => T extends PromiseLike<any> ? never : T,
		errTransformer?: ErrTransformer,
	): AppResult<T> {
		const errMapper = errTransformer ?? DefaultMapErrOp;

		try {
			const val = fn();
			return AppResult.Ok(val);
		} catch (err) {
			return AppResult.Err(errMapper(err as Error));
		}
	}

	static async tryFromPromise<T>(
		promise: Promise<T>,
		errTransformer?: ErrTransformer,
	): Promise<AppResult<T>> {
		const errMapper = errTransformer ?? DefaultMapErrOp;

		try {
			const val = await promise;
			return AppResult.Ok(val);
		} catch (err) {
			const mappedErr = errMapper(err as Error); // convert the error to the appropriate domain error (if u want)
			const res = Err(mappedErr); // create an app error from it
			return new AppResult(res); // use to construct an AppResult
		}
	}

	unwrap(): T {
		// have to add conditional so that the right type of error is thrown
		if (this.inner_result.isOk()) {
			return this.inner_result.unwrap();
		} else {
			throw this.inner_result.unwrapErr();
		}
	}

	unwrapOr(def: T): T {
		return this.inner_result.unwrapOr(def);
	}

	unwrapErr(): AppError {
		return this.inner_result.unwrapErr();
	}

	unwrapOrElse(fn: () => T): T {
		return this.inner_result.unwrapOrElse(fn);
	}

	map<U>(fn: (val: T) => U): AppResult<U> {
		const newResult = this.inner_result.map(fn);

		return AppResult.fromResult(newResult);
	}

	into(): T | undefined {
		return this.inner_result.into();
	}
}

export const toResult = <TRet>(
	_target: any,
	_propertyKey: string,
	descriptor: TypedPropertyDescriptor<(...args: any[]) => TRet>,
) => {
	const original = descriptor.value;

	if (original) {
		// @ts-ignore
		descriptor.value = function(...args: any[]) {
			try {
				const r = original.call(this, ...args);

				return AppResult.Ok(r);
			} catch (err) {
				const e = AppError.fromErr(err as Error);
				return AppResult.Err(e);
			}
		};
	}
};
