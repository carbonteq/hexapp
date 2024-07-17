import { Result } from "@carbonteq/fp";
import {
	AppErrStatus,
	AppError,
	AppResult,
	InvalidOperation,
} from "../../../lib";

describe("when result", () => {
	describe("is okay", () => {
		const okResult = AppResult.Ok(2);

		it("isOkay is true", () => {
			expect(okResult.isOk()).toBeTrue();
		});

		it("safeUnwrap returns the correct value", () => {
			expect(okResult.safeUnwrap()).toBe(2);
		});

		it("unwrap returns the correct value", () => {
			expect(okResult.unwrap()).toBe(2);
		});
	});

	describe("is err", () => {
		const errResult = AppResult.Err(AppError.NotFound());

		it("isOkay is false", () => {
			expect(errResult.isOk()).toBeFalse();
		});

		it("safeUnwrap returns null", () => {
			expect(errResult.safeUnwrap()).toBeNull();
		});

		it("unwrap throws an error", () => {
			expect(() => errResult.unwrap()).toThrow("NotFound");
		});
	});
});

describe("alternative constructors", () => {
	class InvalidOpErr extends InvalidOperation {}

	describe("@carbonteq/fp Result", () => {
		it("ok result from ok result", () => {
			const result = AppResult.fromResult(Result.Ok<number, Error>(20));

			expect(result.isOk()).toBeTrue();
		});

		it("err result from err result", () => {
			const result = AppResult.fromResult(Result.Err(AppError.Generic("")));

			expect(result.isOk()).toBeFalse();
		});

		it("from err result with msg", () => {
			const msg = "some message";
			//@ts-expect-error
			const err = new InvalidOpErr(msg);
			const result = AppResult.fromResult(Result.Err(err));

			expect(result.isOk()).toBeFalse();
			const unwrappedErr = result.unwrapErr();

			expect(unwrappedErr.status).toBe(AppErrStatus.InvalidOperation);
			expect(unwrappedErr.message).toBe(msg);
		});
	});
});
