import * as assert from "node:assert";
import { describe, it } from "node:test";
import {
	Email,
	InvalidEmail,
	InvalidUUID,
	UUID,
} from "@/domain/refined.types.js";

describe("nominal types", () => {
	describe("email creation", () => {
		const emailInner = "foo@bar.baz";

		const valid = Email.create(emailInner);
		const invalid = Email.create("abcdef.xyz");

		it("should allow valid email", () => {
			assert.equal(valid.isOk(), true);

			const unwrapped = valid.unwrap();
			assert.ok(typeof unwrapped === "string");
			assert.equal(unwrapped, emailInner);
		});

		it("should not allow invalid email", () => {
			assert.equal(invalid.isOk(), false);

			const err = invalid.unwrapErr();
			assert.ok(err instanceof InvalidEmail);
			assert.ok(
				typeof err.message === "string" &&
					err.message.startsWith("Invalid Email: "),
			);
		});
	});

	describe("UUID creation", () => {
		const innerUUID = "c882488b-4657-4dfc-b66c-274b9105d0eb";

		const valid = UUID.create(innerUUID);
		const invalid = UUID.create("1234awdjads");

		it("should create valid UUID with init", () => {
			const created = UUID.init();

			assert.ok(typeof created === "string");
			assert.match(
				created,
				/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
			);
		});

		it("should allow valid email", () => {
			assert.equal(valid.isOk(), true);

			const unwrapped = valid.unwrap();
			assert.ok(typeof unwrapped === "string");
			assert.equal(unwrapped, innerUUID);
		});

		it("should not allow invalid email", () => {
			assert.equal(invalid.isOk(), false);

			const err = invalid.unwrapErr();
			assert.ok(err instanceof InvalidUUID);
			assert.ok(
				typeof err.message === "string" &&
					err.message.startsWith("Invalid UUID: "),
			);
		});
	});
});
