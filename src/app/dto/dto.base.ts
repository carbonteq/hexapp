import { DtoValidationResult, fromVal, fromZodErr } from './dto.result';
import { z } from 'zod';

export abstract class BaseDto {
  protected constructor() {}

  protected static validate<T = unknown, U extends z.ZodType<T> = z.ZodType<T>>(
    schema: U,
    data: unknown,
  ): DtoValidationResult<z.infer<U>> {
    const r = schema.safeParse(data);

    if (r.success) {
      return fromVal(r.data);
    } else {
      return fromZodErr(r.error);
    }
  }
}
