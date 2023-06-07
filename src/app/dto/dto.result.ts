import { Result } from '@carbonteq/fp';
import type { ZodError } from 'zod';

import { DtoValidationError } from './dto.error';

export type DtoValidationResult<T> = Result<T, DtoValidationError>;

// export namespace DtoValidationResult {
export const fromVal = <X>(val: X): DtoValidationResult<X> => Result.Ok(val);

export const fromZodErr = (err: ZodError): DtoValidationResult<never> =>
  Result.Err(DtoValidationError.fromZodError(err));
// }

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
