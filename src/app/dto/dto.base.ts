import { ZodUtils } from '../../shared/zod.utils';
import { DtoValidationError } from './dto.error';
import { Result } from '@carbonteq/fp';
import { z } from 'zod';

export type DtoValidationResult<T> = Result<T, DtoValidationError>;

export abstract class BaseDto {
  protected constructor() {}

  protected static validate<T = unknown, U extends z.ZodType<T> = z.ZodType<T>>(
    schema: U,
    data: unknown,
  ): DtoValidationResult<z.infer<U>> {
    return ZodUtils.safeParseResult(
      schema,
      data,
      DtoValidationError.fromZodError,
    );
  }
}

// export class DtoValidationResult<T> extends Result<T, DtoValidationError> {
// 	static fromVal<X>(val: X): DtoValidationResult<X> {
// 		return Result.Ok(val);
// 	}
//
// 	static fromZodErr(err: ZodError): DtoValidationResult<never> {
// 		return Result.Err(DtoValidationError.fromZodError(err));
// 	}
//
// 	// toString(): string {
// 	//   const v = this.safeUnwrap()
// 	//   const e = this.safeUnwrapErr()
// 	//
// 	//   if(v !== null){
// 	//     const x = v
// 	//     // return `DtoValidationResult::Ok<${v.name ? v.name : v}>`
// 	//   }
// 	// }
// }
