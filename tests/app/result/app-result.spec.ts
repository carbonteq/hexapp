import { AppResult, AppResultError } from '@carbonteq/hexapp';
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
    const errResult = AppResult.Err(AppResultError.NotFound);

    it('isOkay is false', () => {
      expect(errResult.isOk).toBeFalse();
    });

    it('into returns undefined', () => {
      expect(errResult.into()).toBeUndefined();
    });

    it('unwrap throws an error', () => {
      expect(() => errResult.unwrap()).toThrow();
    });
  });
});

describe('alternative constructors', () => {
  const val = 2;

  class AppError extends Error {}
  class NotFoundError extends AppError {}
  class InvalidDataError extends AppError {}

  const maybeThrows = (n = -1) => {
    switch (n) {
      case -1:
        return val;
      case 0:
        throw new NotFoundError();
      default:
        throw new InvalidDataError();
    }
  };

  const maybeThrowsPromise = async (n = -1) => {
    return maybeThrows(n);
  };

  const errTransformer = (err: Error): AppResultError => {
    if (err instanceof NotFoundError) return AppResultError.NotFound;
    else if (err instanceof InvalidDataError) return AppResultError.InvalidData;
    else return AppResultError.Unknown;
  };

  describe('Oxide Result', () => {
    it('ok result from ok result', () => {
      const result = AppResult.fromResult(Ok(20));

      expect(result.isOk).toBeTrue();
    });

    it('err result from err result', () => {
      const result = AppResult.fromResult(Err(20));

      expect(result.isOk).toBeFalse();
    });

    it('tryFrom good func', () => {
      const res = AppResult.tryFrom(() => maybeThrows());

      expect(res.into()).toBe(val);
    });

    it('tryFrom bad func', () => {
      const res = AppResult.tryFrom(() => maybeThrows(0));

      expect(res.isOk).toBeFalse();
      expect(res.into()).toBeUndefined();
      expect(res.unwrapErr()).toBe(AppResultError.Unknown);
    });

    it('tryFrom bad func with err transformer (NotFound)', () => {
      const res = AppResult.tryFrom(() => maybeThrows(0), errTransformer);

      expect(res.isOk).toBeFalse();
      expect(res.into()).toBeUndefined();
      expect(res.unwrapErr()).toBe(AppResultError.NotFound);
    });

    it('tryFrom bad func with err transformer (InvalidData)', () => {
      const res = AppResult.tryFrom(() => maybeThrows(1), errTransformer);

      expect(res.isOk).toBeFalse();
      expect(res.into()).toBeUndefined();
      expect(res.unwrapErr()).toBe(AppResultError.InvalidData);
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
      expect(res.unwrapErr()).toBe(AppResultError.Unknown);
    });

    it('tryFrom bad promise with err transformer (NotFound)', async () => {
      const res = await AppResult.tryFromPromise(
        maybeThrowsPromise(0),
        errTransformer,
      );

      expect(res.isOk).toBeFalse();
      expect(res.into()).toBeUndefined();
      expect(res.unwrapErr()).toBe(AppResultError.NotFound);
    });

    it('tryFrom bad promise with err transformer (InvalidData)', async () => {
      const res = await AppResult.tryFromPromise(
        maybeThrowsPromise(1),
        errTransformer,
      );

      expect(res.isOk).toBeFalse();
      expect(res.into()).toBeUndefined();
      expect(res.unwrapErr()).toBe(AppResultError.InvalidData);
    });
  });
});
