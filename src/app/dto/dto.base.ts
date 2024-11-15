import type { Result } from "@carbonteq/fp";
import type { z } from "zod";
import { safeParseResult } from "../../shared/zod.utils.js";
import { DtoValidationError } from "./dto.error.js";

export type DtoValidationResult<T> = Result<T, DtoValidationError>;

export abstract class BaseDto {
  protected constructor() {}

  protected static validate<T = unknown, U extends z.ZodType<T> = z.ZodType<T>>(
    schema: U,
    data: unknown,
  ): DtoValidationResult<z.infer<U>> {
    return safeParseResult(schema, data, DtoValidationError.fromZodError);
  }
}
