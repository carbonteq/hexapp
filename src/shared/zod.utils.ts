import { Result } from "@carbonteq/fp";
import type { ZodType, z } from "zod";
import { fromZodError } from "zod-validation-error";
import { ValidationError } from "../domain";

export type ParsedSchema<T extends ZodType> = Readonly<z.infer<T>>;

export const handleZodErr = (err: z.ZodError) => {
	return new ValidationError(fromZodError(err).message);
};

export const ZodUtils = {
	safeParseResult<E, T = unknown, U extends z.ZodType<T> = z.ZodType<T>>(
		schema: U,
		data: unknown,
		errConst: (err: z.ZodError) => E,
	): Result<z.infer<U>, E> {
		const r = schema.safeParse(data);

		if (r.success) {
			return Result.Ok(r.data);
		}
		const err = errConst(r.error);
		return Result.Err(err);
	},
};
