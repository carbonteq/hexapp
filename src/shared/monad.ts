import { Ok, Result } from 'oxide.ts';

type OkOrErr = 'Ok' | 'Err';
const okPred = <T, E>(el: Result<T, E>): boolean => el.isOk();
const errPred = <T, E>(el: Result<T, E>): boolean => el.isErr();
const preds = [okPred, errPred];

export class Monadic {
	static bind<T, E, U>(r: Result<T, E>, f: (val: T) => Result<U, E>) {
		if (r.isErr()) return r;

		const val = r.unwrap();

		return f(val);
	}

	static async bindAsync<T, E, U>(
		r: Result<T, E>,
		f: (val: T) => Promise<Result<U, E>>,
	) {
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
