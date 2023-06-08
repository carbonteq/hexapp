import { Result } from '@carbonteq/fp';
import { z } from 'zod';

export class ZodUtils {
  static safeParseResult<E, T = unknown, U extends z.ZodType<T> = z.ZodType<T>>(
    schema: U,
    data: unknown,
    errConst: (err: z.ZodError) => E,
  ): Result<z.infer<U>, E> {
    const r = schema.safeParse(data);

    if (r.success) {
      return Result.Ok(r.data);
    } else {
      const err = errConst(r.error);
      return Result.Err(err);
    }
  }
}
