import {
  AlreadyExistsError,
  InvalidOperation,
  NotFoundError,
  UnauthorizedOperation,
  ValidationError,
} from "../../domain/base.errors.js";
import { AppErrStatus } from "./status.js";

export class AppError extends Error {
  private constructor(
    readonly status: AppErrStatus,
    message?: string,
  ) {
    let msg: string;
    if (message) {
      msg = message;
    } else {
      msg = `AppError<${status}>`;
    }

    super(msg);
  }

  static NotFound = (msg?: string): AppError =>
    new AppError(AppErrStatus.NotFound, msg);

  static Unauthorized = (msg?: string): AppError =>
    new AppError(AppErrStatus.Unauthorized, msg);

  static InvalidData = (msg?: string): AppError =>
    new AppError(AppErrStatus.InvalidData, msg);

  static InvalidOperation = (msg?: string): AppError =>
    new AppError(AppErrStatus.InvalidOperation, msg);

  static AlreadyExists = (msg?: string): AppError =>
    new AppError(AppErrStatus.AlreadyExists, msg);

  static GuardViolation = (msg?: string): AppError =>
    new AppError(AppErrStatus.GuardViolation, msg);

  static Generic = (msg: string): AppError =>
    new AppError(AppErrStatus.Generic, msg);

  static fromErr = (e: Error): AppError => {
    if (e instanceof AppError) {
      return new AppError(e.status, e.message);
    }

    if (e instanceof NotFoundError) {
      return AppError.NotFound(e.message);
    }

    if (e instanceof AlreadyExistsError) {
      return AppError.AlreadyExists(e.message);
    }

    if (e instanceof InvalidOperation) {
      return AppError.InvalidOperation(e.message);
    }

    if (e instanceof UnauthorizedOperation) {
      return AppError.Unauthorized(e.message);
    }

    if (e instanceof ValidationError) {
      return AppError.InvalidData(e.message);
    }

    return AppError.Generic(e.message);
  };
}
