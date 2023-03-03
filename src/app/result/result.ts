import { Unit, Monadic } from '@carbonteq/hexapp/shared';
import { Err, Ok, Result } from 'oxide.ts';
import { AppError } from './error';

type InnerResult<T> = Result<T, AppError>;

type ErrTransformer = (err: Error) => AppError;
const DefaultMapErrOp: ErrTransformer = (err: Error) => {
	return AppError.fromErr(err);
};

export type EmptyResult = typeof AppResult.Empty;

export class AppResult<T> {
	readonly _isOk: boolean;

	static readonly Empty: AppResult<Unit> = AppResult.Ok({});

	private constructor(private readonly inner_result: InnerResult<T>) {
		this._isOk = inner_result.isOk();
	}

	isOk(): boolean {
		return this.inner_result.isOk();
	}

	isErr(): this is AppResult<never> {
		return this.inner_result.isErr();
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

	toResult(): Result<T, AppError> {
		return this.inner_result;
	}

	and<U>(other: AppResult<U>): AppResult<readonly [T, U]> {
		const r = Monadic.bind(this.inner_result, (t) =>
			other.inner_result.map((u) => [t, u] as const),
		);

		return new AppResult(r);
	}

	do(f: (val: T) => void): void {
		Monadic.do(this.inner_result, f);
	}

	async doAsync(f: (val: T) => Promise<void>) {
		await Monadic.doAsync(this.inner_result, f);
	}

	static fromOther<T>(result: AppResult<T>): AppResult<T> {
		return new AppResult(result.inner_result);
	}

	static fromErr(err: Error): AppResult<never> {
		const e = AppError.fromErr(err);

		return new AppResult(Err(e));
	}

	bind<U>(f: (r: T) => Result<U, AppError>): AppResult<U> {
		const r = Monadic.bind(this.inner_result, f);

		return new AppResult(r);
	}

	async bindAsync<U>(
		f: (r: T) => Promise<Result<U, AppError>>,
	): Promise<AppResult<U>> {
		const r = await Monadic.bindAsync(this.inner_result, f);

		return new AppResult(r);
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

export const toAppResult = <TRet>(
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
