import { AppResult, AppResultError } from '@carbonteq/app-result';
import { Ok, Err } from 'oxide.ts';

describe('when result', () => {
  describe('is okay', () => {
    const okResult = AppResult.Ok(2);

    it('isOkay is true', () => {
      expect(okResult.isOk).toBe(true);
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
      expect(errResult.isOk).toBe(false);
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
  const maybeThrows = (b: boolean) => {
    if (b) throw new Error('err');
    else return val;
  };

  const maybeThrowsPromise = async (b: boolean) => {
    return maybeThrows(b);
  };

  describe('Oxide Result', () => {
    it('ok result from ok result', () => {
      const result = AppResult.fromResult(Ok(20));

      expect(result.isOk).toBe(true);
    });

    it('err result from err result', () => {
      const result = AppResult.fromResult(Err(20));

      expect(result.isOk).toBe(false);
    });

    it('tryFrom good func', () => {
      const res = AppResult.tryFrom(() => maybeThrows(false));

      expect(res.into()).toBe(val);
    });

    it('tryFrom bad func', () => {
      const res = AppResult.tryFrom(() => maybeThrows(true));

      expect(res.isOk).toBe(false);
      expect(res.into()).toBeUndefined();
    });

    it('tryFrom good promise', async () => {
      const res = await AppResult.tryFromPromise(maybeThrowsPromise(false));

      expect(res.isOk).toBe(true);
      expect(res.into()).toBe(val);
    });

    it('tryFrom bad promise', async () => {
      const res = await AppResult.tryFromPromise(maybeThrowsPromise(true));

      expect(res.isOk).toBe(false);
      expect(res.into()).toBeUndefined();
    });
  });
});
