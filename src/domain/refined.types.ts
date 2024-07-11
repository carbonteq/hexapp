import { randomUUID } from "node:crypto";
import { Result } from "@carbonteq/fp";
import z, { type ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { extend } from "../shared/misc.utils";
import { type DomainError, ValidationError } from "./base.errors";

type Extensions<
	U extends z.ZodTypeAny,
	sym extends string | symbol,
	E extends DomainError,
> = {
	create: (data: unknown) => Result<z.infer<U> & z.BRAND<sym>, E>;
};

type ZodBrandedWithFactory<
	U extends z.ZodTypeAny,
	sym extends string | symbol,
	E extends DomainError,
> = z.ZodBranded<U, sym> & Extensions<U, sym, E>;

const defaultFromZodErr = (_data: unknown, err: z.ZodError) =>
	new ValidationError(fromZodError(err).message);

export function createRefinedType<
	sym extends string | symbol,
	U extends z.ZodTypeAny,
	E extends DomainError,
>(
	_tag: sym,
	schema: U,
	errTransformer: (data: U["_input"], err: z.ZodError) => E,
): ZodBrandedWithFactory<U, sym, E>;
export function createRefinedType<
	sym extends string | symbol,
	U extends z.ZodTypeAny,
>(_tag: sym, schema: U): ZodBrandedWithFactory<U, sym, ValidationError>;
export function createRefinedType<
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

	const extensions: Extensions<U, sym, E> = {
		create: factory,
	};
	const finalBranded = extend(branded, extensions);

	return finalBranded;
}

export type Unbrand<T> = T extends z.ZodType<unknown, z.ZodTypeDef, infer U>
	? U
	: T;

export class InvalidUUID extends ValidationError {
	constructor(data: unknown) {
		super(`Invalid UUID: ${data}`);
	}
}

// Example of how to use refined branded types with Zod
// Custom error type not mandatory
export class InvalidEmail extends ValidationError {
	constructor(data: unknown) {
		super(`Invalid Email: ${data}`);
	}
}

export const Email = createRefinedType(
	"Email",
	z.string().email(),

	(data, _err) => new InvalidEmail(data),
);
export type Email = z.infer<typeof Email>;

// Not a good example as I wanted to add some custom stuff
const UUIDInner = createRefinedType(
	"UUID",
	z.string().uuid(),
	(data, _err) => new InvalidUUID(data),
);
export type UUID = z.infer<typeof UUIDInner>;
export const UUID = extend(UUIDInner, {
	init: () => randomUUID() as UUID,
	fromTrusted: (uuid: string) => uuid as UUID,
});

export class InvalidDateTime extends ValidationError {
	constructor(data: unknown) {
		super(`Invalid DateTime: ${data}`);
	}
}
const DTInner = createRefinedType(
	"DateTime",
	z.union([z.number(), z.string(), z.date()]).pipe(z.coerce.date()),
	(data, _err) => new InvalidDateTime(data),
);
export type DateTime = z.infer<typeof DTInner>;
export const DateTime = extend(DTInner, {
	now: () => new Date() as DateTime,
	from: (d: Date) => d as DateTime,
});

// Enum types
export class EnumValidationError extends ValidationError {
	constructor(
		msg: string,
		readonly data: unknown,
		readonly err: ZodError,
	) {
		super(msg);
	}
}

export const createEnumType = <
	Sym extends string,
	U extends string,
	T extends [U, ...U[]],
>(
	tag: Sym,
	enumValues: T,
) => {
	const innerType = createRefinedType(
		tag,
		z.enum(enumValues),
		(data, err) =>
			new EnumValidationError(
				`${tag}: <${data}> must be one of [${enumValues}]`,
				data,
				err,
			),
	);
	type Inner = z.infer<typeof innerType>;

	return extend(innerType, {
		from(val: Unbrand<typeof innerType>) {
			return val as Inner;
		},
	});
};
