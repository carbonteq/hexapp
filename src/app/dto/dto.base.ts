import { z } from 'zod';
import { DtoValidationResult } from './dto.result';

export abstract class BaseDto {
  protected constructor() { }

  protected static validate<T, U extends z.ZodType<T> = z.ZodType<T>>(
    schema: U,
    data: any,
  ): DtoValidationResult<T> {
    const r = schema.safeParse(data);

    if (r.success) {
      return DtoValidationResult.fromVal(r.data);
    } else {
      return DtoValidationResult.fromZodError(r.error);
    }
  }
}
