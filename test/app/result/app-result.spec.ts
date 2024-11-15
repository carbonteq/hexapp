import { Result } from "@carbonteq/fp";
import { AppErrStatus, AppError, AppResult } from "@/app/result/index.js";
import { InvalidOperation } from "@/domain/base.errors.js";
import * as assert from "node:assert";
import { describe, it } from "node:test";

describe("when result", () => {
	describe("is okay", () => {
		const okResult = AppResult.Ok(2);

		it("isOkay is true", () => {
			assert.equal(okResult.isOk(), true);
		});

		it("safeUnwrap returns the correct value", () => {
			assert.equal(okResult.safeUnwrap(), 2);
		});

		it("unwrap returns the correct value", () => {
			assert.equal(okResult.unwrap(), 2);
		});
	});

	describe("is err", () => {
		const errResult = AppResult.Err(AppError.NotFound());

		it("isOkay is false", () => {
			assert.equal(errResult.isOk(), false);
		});

		it("safeUnwrap returns null", () => {
			assert.equal(errResult.safeUnwrap(), null);
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

			assert.equal(result.isOk(), true);
		});

		it("err result from err result", () => {
			const result = AppResult.fromResult(Result.Err(AppError.Generic("")));

			assert.equal(result.isOk(), false);
		});

		it("from err result with msg", () => {
			const msg = "some message";
			//@ts-expect-error
			const err = new InvalidOpErr(msg);
			const result = AppResult.fromResult(Result.Err(err));

			assert.equal(result.isOk(), false);
			const unwrappedErr = result.unwrapErr();

			assert.equal(unwrappedErr.status, AppErrStatus.InvalidOperation);
			assert.equal(unwrappedErr.message, msg);
		});
	});
});
