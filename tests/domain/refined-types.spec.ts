import { Email, InvalidEmail, InvalidUUID, UUID } from "../../lib";
import "jest-extended";

describe("nominal types", () => {
	describe("email creation", () => {
		const emailInner = "foo@bar.baz";

		const valid = Email.create(emailInner);
		const invalid = Email.create("abcdef.xyz");

		it("should allow valid email", () => {
			expect(valid.isOk()).toBeTrue();

			const unwrapped = valid.unwrap();
			expect(unwrapped).toBeString();
			expect(unwrapped).toStrictEqual(emailInner);
		});

		it("should not allow invalid email", () => {
			expect(invalid.isOk()).toBeFalse();

			const err = invalid.unwrapErr();
			expect(err).toBeInstanceOf(InvalidEmail);
			expect(err.message).toStartWith("Invalid Email: ");
		});
	});

	describe("UUID creation", () => {
		const innerUUID = "c882488b-4657-4dfc-b66c-274b9105d0eb";

		const valid = UUID.create(innerUUID);
		const invalid = UUID.create("1234awdjads");

		it("should create valid UUID with init", () => {
			const created = UUID.init();

			expect(created).toBeString();
			expect(created).toMatch(
				/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
			);
		});

		it("should allow valid email", () => {
			expect(valid.isOk()).toBeTrue();

			const unwrapped = valid.unwrap();
			expect(unwrapped).toBeString();
			expect(unwrapped).toStrictEqual(innerUUID);
		});

		it("should not allow invalid email", () => {
			expect(invalid.isOk()).toBeFalse();

			const err = invalid.unwrapErr();
			expect(err).toBeInstanceOf(InvalidUUID);
			expect(err.message).toStartWith("Invalid UUID: ");
		});
	});
});
