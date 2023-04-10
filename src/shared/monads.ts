export class UnwrappedErrWithOk extends Error {
	constructor(r: Result<any, any>) {
		super(`Attempted to call unwrapErr on an okay value: <${r}>`);
	}
}

export class UnwrappedOkWithErr extends Error {
	constructor(r: Result<any, any>) {
		super(`Attempted to call unwrap on an Err value: <${r}>`);
	}
}

type Mapper<T, U> = (val: T) => U;
type AsyncMapper<T, U> = (val: T) => Promise<U>;
type PureResMapper<T, U, E> = (val: T) => Result<U, E>;
type PureAsyncResMapper<T, U, E> = (val: T) => Promise<Result<U, E>>;

type OkOrErr = 'ok' | 'err';
const okPred = <T, E extends Error>(el: Result<T, E>): boolean => el.isOk();
const errPred = <T, E extends Error>(el: Result<T, E>): boolean => el.isErr();
const preds = [okPred, errPred];

type UnwrapResult<T extends Result<unknown, unknown>> = T extends Result<
	infer U,
	infer E
>
	? { ok: U; err: E }
	: never;

type CombinedResultOk<T extends Result<unknown, unknown>[]> = {
	[K in keyof T]: UnwrapResult<T[K]>['ok'];
};
type CombinedResultErr<T extends Result<unknown, unknown>[]> = {
	[K in keyof T]: UnwrapResult<T[K]>['err'];
}[number];

export class Result<T, E> {
	private constructor(
		private readonly val: T | null,
		private readonly error: E | null,
	) {}

	static Ok<T, E>(val: T): Result<T, E> {
		return new Result(val, null) as Result<T, never>;
	}

	static Err<T, E>(err: E): Result<T, E> {
		return new Result(null, err) as Result<never, E>;
	}

	isOk(): this is Result<T, never> {
		return this.val !== null;
	}

	isErr(): this is Result<never, E> {
		return this.error !== null;
	}

	toString(): string {
		if (this.val !== null) {
			return `Result::Ok<${JSON.stringify(this.val)}>`;
		} else {
			return `Result::Err<${this.error}>`;
		}
	}

	unwrap(): T {
		if (this.isErr()) {
			if (this.error instanceof Error) throw this.error;

			throw new UnwrappedOkWithErr(this);
		}

		return this.val as T;
	}

	unwrapErr(): E {
		if (this.isOk()) {
			throw new UnwrappedErrWithOk(this);
		}

		return this.error as E;
	}

	map<U>(f: (val: T) => U): Result<U, E> {
		if (this.val === null) return new Result(null, this.error) as Result<U, E>;

		const valPrime = f(this.val);

		return new Result(valPrime, this.error);
	}

	mapErr<U extends Error>(fn: (err: E) => U): Result<T, U> {
		if (this.error !== null) {
			const mappedErr = fn(this.error);

			return Result.Err(mappedErr);
		}

		return Result.Ok(this.val as T);
	}

	/**
	 * Also known as `bind` or `fmap`
	 */
	andThen<U, E2>(fn: (val: T) => Result<U, E2>): Result<U, E | E2>;
	andThen<U, E2>(
		fn: (val: T) => Promise<Result<U, E | E2>>,
	): Promise<Result<U, E | E2>>;
	andThen<U, E2>(
		fn: PureResMapper<T, U, E | E2> | PureAsyncResMapper<T, U, E | E2>,
	) {
		if (this.isOk()) return fn(this.val as T);

		return Result.Err(this.error as E);
	}

	do(fn: (val: T) => void): Result<T, E> {
		if (this.val !== null) {
			fn(this.val);
		}

		return this;
	}

	async doAsync(fn: (val: T) => Promise<void>): Promise<Result<T, E>> {
		if (this.val !== null) {
			await fn(this.val);
		}

		return this;
	}

	zipF<U, E2>(f: (val: T) => Result<U, E2>): Result<[T, U], E | E2> {
		if (this.error !== null) return Result.Err(this.error);

		return f(this.val as T).map((u) => [this.val, u] as [T, U]);
	}

	async zipFAsync<U, E2>(
		f: (val: T) => Promise<Result<U, E2>>,
	): Promise<Result<[T, U], E | E2>> {
		if (this.error !== null) return Result.Err(this.error);

		return f(this.val as T).then((uRes) =>
			uRes.map((u) => [this.val, u] as [T, U]),
		);
	}

	//#region General combo functions
	static allM<T, E extends Error>(
		c: 'ok',
		seq: Result<T, E>[],
	): seq is Result<T, never>[];
	static allM<T, E extends Error>(
		c: 'err',
		seq: Result<T, E>[],
	): seq is Result<never, E>[];
	static allM<T, E extends Error>(c: OkOrErr, seq: Result<T, E>[]): boolean {
		const pred = preds[Number(c === 'ok')];

		for (const el of seq) {
			if (!pred(el)) return false;
		}

		return true;
	}

	static anyM<T, E extends Error>(c: OkOrErr, seq: Result<T, E>[]): boolean {
		const pred = preds[Number(c === 'ok')];

		for (const el of seq) {
			if (pred(el)) return true;
		}

		return false;
	}

	/**
	 * `Result.sequence(Result<T1, E1>, Result<T2, E2>, ...)` will return `Result<[T1, T2, ...], E1 | E2 | ...>`
	 * @example
	 * const r1 = Result.Ok<string, string>("abc")
	 * const r2 = Result.Ok<number, Error>(123)
	 * const r = Result.sequence(r1, r2) // r will be of type Result<[string, number], string | Error>
	 */
	static sequence<T extends Result<unknown, unknown>[]>(
		...results: T
	): Result<CombinedResultOk<T>, CombinedResultErr<T>> {
		const vals = [] as CombinedResultOk<T>;

		for (const r of results) {
			if (r.isErr()) return r;

			vals.push(r.unwrap());
		}

		return Result.Ok(vals) as Result<CombinedResultOk<T>, CombinedResultErr<T>>;
	}

	static async lift<T, E extends Error>(
		r: Result<Promise<T>, E>,
	): Promise<Result<T, E>> {
		if (r.isErr()) return r;

		return (r.val as Promise<T>).then((v) => Result.Ok(v));
	}
	//#endregion
}

// Option

type OptMapper<T, U> = (val: T) => Option<U>;
type AsyncOptMapper<T, U> = (val: T) => Promise<Option<U>>;

export class Option<T> {
	private constructor(readonly val: T, readonly ok: boolean) {}

	static readonly None: Option<never> = new Option({} as never, false);

	static Some<X>(val: X): Option<X> {
		return new Option(val, true);
	}

	isSome(): this is Option<T> {
		return this.ok;
	}

	isNone(): this is Option<never> {
		return !this.ok;
	}

	map<U>(fn: (val: T) => U): Option<U>;
	map<U>(fn: (val: T) => Promise<U>): Promise<Option<U>>;
	map<U>(fn: OptMapper<T, U> | AsyncOptMapper<T, U>) {
		if (this.isNone()) return Option.None;

		const val = fn(this.val);
		if (val instanceof Promise) return val.then((u) => Option.Some(u));

		return Option.Some(val);
	}

	mapOr<U>(def: U, fn: (val: T) => U): Option<U>;
	mapOr<U>(def: U, fn: (val: T) => Promise<U>): Promise<Option<U>>;
	mapOr<U>(def: U, fn: (val: T) => U) {
		if (this.isNone()) return Option.Some(def);

		const val = fn(this.val);
		if (val instanceof Promise) return val.then((u) => Option.Some(u));

		return Option.Some(val);
	}

	okOr<E extends Error>(err: E): Result<T, E> {
		if (this.isNone()) return Result.Err(err);

		return Result.Ok(this.val);
	}

	okOrElse<E extends Error>(f: () => E): Result<T, E> {
		if (this.isNone()) return Result.Err(f());

		return Result.Ok(this.val);
	}
}
