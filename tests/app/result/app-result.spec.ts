import {
	AppResult,
	AppError,
	AppErrStatus,
} from '@carbonteq/hexapp/app/result';
import {
	NotFoundError,
	InvalidOperation,
} from '@carbonteq/hexapp/domain/base.exception';
import { Ok, Err } from 'oxide.ts';

describe('when result', () => {
	describe('is okay', () => {
		const okResult = AppResult.Ok(2);

		it('isOkay is true', () => {
			expect(okResult.isOk).toBeTrue();
		});

		it('into returns the correct value', () => {
			expect(okResult.into()).toBe(2);
		});

		it('unwrap returns the correct value', () => {
			expect(okResult.unwrap()).toBe(2);
		});
	});

	describe('is err', () => {
		const errResult = AppResult.Err(AppError.NotFound());

		it('isOkay is false', () => {
			expect(errResult.isOk).toBeFalse();
		});

		it('into returns undefined', () => {
			expect(errResult.into()).toBeUndefined();
		});

		it('unwrap throws an error', () => {
			expect(() => errResult.unwrap()).toThrow('NotFound');
		});
	});
});

describe('alternative constructors', () => {
	const val = 2;

	class NotFoundErr extends NotFoundError {
		constructor() {
			super('');
		}
	}

	class InvalidOpErr extends InvalidOperation {
		constructor() {
			super('');
		}
	}

	const maybeThrows = (n = -1) => {
		switch (n) {
			case -1:
				return val;
			case 0:
				throw new NotFoundErr();
			default:
				throw new InvalidOpErr();
		}
	};

	const maybeThrowsPromise = async (n = -1) => {
		return maybeThrows(n);
	};

	const errTransformer = (err: Error): AppError => {
		if (err instanceof NotFoundError) {
			return AppError.NotFound(err.message);
		} else if (err instanceof InvalidOperation) {
			return AppError.InvalidOperation(err.message);
		} else {
			return AppError.Unknown(err.message);
		}
	};

	describe('Oxide Result', () => {
		it('ok result from ok result', () => {
			const result = AppResult.fromResult(Ok(20));

			expect(result.isOk).toBeTrue();
		});

		it('err result from err result', () => {
			const result = AppResult.fromResult(Err(AppError.Unknown()));

			expect(result.isOk).toBeFalse();
		});

		it('from err result with msg', () => {
			const msg = 'some message';
			const err = AppError.InvalidOperation(msg);
			const result = AppResult.fromResult(Err(err));

			expect(result.isOk).toBeFalse();
			const unwrappedErr = result.unwrapErr();

			expect(unwrappedErr.status).toBe(AppErrStatus.InvalidOperation);
			expect(unwrappedErr.message).toBe(
				`AppResult<InvalidOperation>: "${msg}"`,
			);
		});

		it('tryFrom good func', () => {
			const res = AppResult.tryFrom(() => maybeThrows());

			expect(res.into()).toBe(val);
		});

		it('tryFrom bad func', () => {
			const fn = () => maybeThrows(0);
			const res = AppResult.tryFrom(fn);

			expect(res.isOk).toBeFalse();
			expect(res.into()).toBeUndefined();

			expect(res.unwrapErr().status).toBe(AppErrStatus.NotFound);
		});

		it('tryFrom bad func with err transformer (NotFound)', () => {
			const res = AppResult.tryFrom(() => maybeThrows(0), errTransformer);

			expect(res.isOk).toBeFalse();
			expect(res.into()).toBeUndefined();

			const unwrapped = res.unwrapErr();
			expect(unwrapped.status).toBe(AppErrStatus.NotFound);
			expect(unwrapped.message).toBe('AppResult<NotFound>');
		});

		it('tryFrom bad func with err transformer (InvalidOperation)', () => {
			const res = AppResult.tryFrom(() => maybeThrows(1), errTransformer);

			expect(res.isOk).toBeFalse();
			expect(res.into()).toBeUndefined();
			expect(res.unwrapErr().status).toBe(AppErrStatus.InvalidOperation);
		});

		it('tryFrom good promise', async () => {
			const res = await AppResult.tryFromPromise(maybeThrowsPromise());

			expect(res.isOk).toBeTrue();
			expect(res.into()).toBe(val);
		});

		it('tryFrom bad promise', async () => {
			const res = await AppResult.tryFromPromise(maybeThrowsPromise(0));

			expect(res.isOk).toBeFalse();
			expect(res.into()).toBeUndefined();
			expect(res.unwrapErr().status).toBe(AppErrStatus.NotFound);
		});

		it('tryFrom bad promise with err transformer (NotFound)', async () => {
			const res = await AppResult.tryFromPromise(
				maybeThrowsPromise(0),
				errTransformer,
			);

			expect(res.isOk).toBeFalse();
			expect(res.into()).toBeUndefined();
			expect(res.unwrapErr().status).toBe(AppErrStatus.NotFound);
		});

		it('tryFrom bad promise with err transformer (InvalidData)', async () => {
			const res = await AppResult.tryFromPromise(
				maybeThrowsPromise(1),
				errTransformer,
			);

			expect(res.isOk).toBeFalse();
			expect(res.into()).toBeUndefined();
			expect(res.unwrapErr().status).toBe(AppErrStatus.InvalidOperation);
		});
	});
});
