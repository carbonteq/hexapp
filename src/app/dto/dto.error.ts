import type { ZodError } from "zod";
import { fromZodError as zodErrTransform } from "zod-validation-error";
import { ValidationError } from "../../domain/base.errors.js";

export class DtoValidationError extends ValidationError {
  constructor(msg: string, err?: Error) {
    super(msg);

    this.name = "DTOValidationError";
    this.message = msg;
    if (err) {
      this.stack = err.stack;
    }
  }

  static fromZodError(err: ZodError): DtoValidationError {
    const prettyErrMsg = zodErrTransform(err).message;

    return new DtoValidationError(prettyErrMsg, err);
  }
}
