import * as assert from "node:assert";
import { describe, it } from "node:test";
import { AppErrStatus, AppError, AppResult } from "@/app/result/index.js";
import { InvalidOperation } from "@/domain/base.errors.js";
import { Result } from "@carbonteq/fp";

describe("when result", () => {
  describe("is okay", () => {
    const okResult = AppResult.Ok(2);

    it("isOkay is true", () => {
      assert.strictEqual(okResult.isOk(), true);
    });

    it("safeUnwrap returns the correct value", () => {
      assert.strictEqual(okResult.safeUnwrap(), 2);
    });

    it("unwrap returns the correct value", () => {
      assert.strictEqual(okResult.unwrap(), 2);
    });
  });

  describe("is err", () => {
    const errResult = AppResult.Err(AppError.NotFound());

    it("isOkay is false", () => {
      assert.strictEqual(errResult.isOk(), false);
    });

    it("safeUnwrap returns null", () => {
      assert.strictEqual(errResult.safeUnwrap(), null);
    });

    it("unwrap throws an error", () => {
      assert.throws(() => errResult.unwrap(), "NotFound");
    });
  });
});

describe("alternative constructors", () => {
  class InvalidOpErr extends InvalidOperation {}

  describe("@carbonteq/fp Result", () => {
    it("ok result from ok result", () => {
      const result = AppResult.fromResult(Result.Ok<number, Error>(20));

      assert.strictEqual(result.isOk(), true);
    });

    it("err result from err result", () => {
      const result = AppResult.fromResult(Result.Err(AppError.Generic("")));

      assert.strictEqual(result.isOk(), false);
    });

    it("from err result with msg", () => {
      const msg = "some message";
      //@ts-expect-error
      const err = new InvalidOpErr(msg);
      const result = AppResult.fromResult(Result.Err(err));

      assert.strictEqual(result.isOk(), false);
      const unwrappedErr = result.unwrapErr();

      assert.strictEqual(unwrappedErr.status, AppErrStatus.InvalidOperation);
      assert.strictEqual(unwrappedErr.message, msg);
    });
  });
});
