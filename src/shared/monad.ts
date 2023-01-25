import { Ok, Result } from 'oxide.ts';

type OkOrErr = 'Ok' | 'Err';
const okPred = <T, E>(el: Result<T, E>): boolean => el.isOk();
const errPred = <T, E>(el: Result<T, E>): boolean => el.isErr();
const preds = [okPred, errPred];

export class Monadic {
	static async mapAsync<T, E, U>(
		r: Result<T, E>,
		f: (v: T) => Promise<U>,
	): Promise<Result<U, E>> {
		const resultOfPromise = r.map(f);

		return Monadic.liftAsync(resultOfPromise);
	}

	static do<T, E>(r: Result<T, E>, f: (v: T) => void): Result<T, E> {
		return r.map((val) => {
			f(val);
			return val;
		});
	}

	static async doAsync<T, E>(
		r: Result<T, E>,
		f: (v: T) => Promise<void>,
	): Promise<Result<T, E>> {
		const res = r.map(async (val) => {
			f(val);
			return val;
		});
		const r2 = await Monadic.liftAsync(res);

		return r2;
	}

	static async liftAsync<T, E>(
		r: Result<Promise<T>, E>,
	): Promise<Result<T, E>> {
		if (r.isErr()) return r;

		const p = await r.unwrap();

		return Ok(p);
	}

	static bind<T, U, E1, E2>(
		r: Result<T, E1>,
		f: (val: T) => Result<U, E2>,
	): Result<U, E1 | E2> {
		if (r.isErr()) return r;

		const val = r.unwrap();

		return f(val);
	}

	static async bindAsync<T, U, E1, E2>(
		r: Result<T, E1>,
		f: (val: T) => Promise<Result<U, E2>>,
	): Promise<Result<U, E1 | E2>> {
		if (r.isErr()) return r;

		const val = r.unwrap();

		return await f(val);
	}

	static sequence<T, E>(r: Array<Result<T, E>>): Result<Array<T>, E> {
		const results = [];

		for (const el of r) {
			if (el.isErr()) return el;

			results.push(el.unwrap());
		}

		return Ok(results);
	}

	static allM<T, E>(c: OkOrErr, seq: Result<T, E>[]): boolean {
		const pred = preds[Number(c === 'Ok')];

		for (const el of seq) {
			if (!pred(el)) {
				return false;
			}
		}

		return true;
	}

	static anyM<T, E>(c: OkOrErr, seq: Result<T, E>[]): boolean {
		const pred = preds[Number(c === 'Ok')];

		for (const el of seq) {
			if (pred(el)) {
				return true;
			}
		}

		return false;
	}
}
