import { randomUUID } from "node:crypto";
import { Result } from "@carbonteq/fp";
import z from "zod";
import { fromZodError } from "zod-validation-error";
import { type DomainError, ValidationError } from "./base.errors";

type ZodBrandedWithFactory<
	U extends z.ZodTypeAny,
	sym extends string | symbol,
	E extends DomainError,
> = z.ZodBranded<U, sym> & {
	create: (data: unknown) => Result<z.infer<U> & z.BRAND<sym>, E>;
};

const defaultFromZodErr = (_data: unknown, err: z.ZodError) =>
	new ValidationError(fromZodError(err).message);

export function refinedWithZod<
	sym extends string | symbol,
	U extends z.ZodTypeAny,
	E extends DomainError,
>(
	_tag: sym,
	schema: U,
	errTransformer: (data: U["_input"], err: z.ZodError) => E,
): ZodBrandedWithFactory<U, sym, E>;
export function refinedWithZod<
	sym extends string | symbol,
	U extends z.ZodTypeAny,
>(_tag: sym, schema: U): ZodBrandedWithFactory<U, sym, ValidationError>;
export function refinedWithZod<
	sym extends string | symbol,
	U extends z.ZodTypeAny,
	E extends DomainError,
>(
	_tag: sym,
	schema: U,
	errConst?: (data: U["_input"], err: z.ZodError) => E,
): ZodBrandedWithFactory<U, sym, E> {
	const errTransformer = errConst ?? defaultFromZodErr;
	const branded = schema.brand<sym>();
	const factory = (data: unknown): Result<U["_output"], E> => {
		const res = branded.safeParse(data);

		if (res.success) return Result.Ok(res.data);
		const err = errTransformer(data, res.error) as E;
		return Result.Err(err);
	};

	const finalBranded = branded as ZodBrandedWithFactory<U, sym, E>;
	finalBranded.create = factory;

	return finalBranded;
}

export class InvalidUUID extends ValidationError {
	constructor(data: unknown) {
		super(`Invalid UUID: ${data}`);
	}
}

// Not a good example as I wanted to add some custom stuff
const UUIDInner = refinedWithZod(
	"UUID",
	z.string().uuid(),
	(data, _err) => new InvalidUUID(data),
);
export const UUID = UUIDInner as typeof UUIDInner & {
	init: () => z.infer<typeof UUIDInner>;
};
UUID.init = () => randomUUID() as string & z.BRAND<"UUID">;
export type UUID = z.infer<typeof UUID>;

// Example of how to use refined branded types with Zod
// Custom error type not mandatory
export class InvalidEmail extends ValidationError {
	constructor(data: unknown) {
		super(`Invalid Email: ${data}`);
	}
}
export const Email = refinedWithZod(
	"Email",
	z.string().email(),

	(data, _err) => new InvalidEmail(data),
);
export type Email = z.infer<typeof Email>;
