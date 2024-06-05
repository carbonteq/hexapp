import { Result } from "@carbonteq/fp";
import type { z } from "zod";

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
