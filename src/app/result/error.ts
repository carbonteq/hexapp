import {
	ExternalServiceFailure,
	InvalidOperation,
	UnauthorizedOperation,
	ValidationError,
	AlreadyExistsError,
	NotFoundError,
} from '@carbonteq/hexapp/domain/base.exception';
import { AppErrStatus } from './status';

export class AppError extends Error {
	private constructor(readonly status: AppErrStatus, message?: string) {
		let msg = `AppError<${status}>`;
		if (message) {
			msg += `: "${message}"`;
		}

		super(msg);
	}

	static NotFound = (msg?: string) => new AppError(AppErrStatus.NotFound, msg);

	static Unauthorized = (msg?: string) =>
		new AppError(AppErrStatus.Unauthorized, msg);

	static InvalidData = (msg?: string) =>
		new AppError(AppErrStatus.InvalidData, msg);

	static InvalidOperation = (msg?: string) =>
		new AppError(AppErrStatus.InvalidOperation, msg);

	static AlreadyExists = (msg?: string) =>
		new AppError(AppErrStatus.AlreadyExists, msg);

	static ExternalServiceFailure = (msg?: string) =>
		new AppError(AppErrStatus.ExternalServiceFailure, msg);

	static Generic = (msg: string) => new AppError(AppErrStatus.Generic, msg);

	static fromErr = (e: Error) => {
		if (e instanceof NotFoundError) {
			return AppError.NotFound(e.message);
		}

		if (e instanceof AlreadyExistsError) {
			return AppError.AlreadyExists(e.message);
		}

		if (e instanceof ExternalServiceFailure) {
			return AppError.ExternalServiceFailure(e.message);
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
