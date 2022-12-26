import { AppErrStatus } from './status';

export class AppError extends Error {
	private constructor(readonly status: AppErrStatus, message?: string) {
		let msg = `AppResult<${status}>`;
		if (message) {
			msg += `: "${message}"`;
		}

		super(msg);
	}

	static Unknown = (msg?: string): AppError =>
		new AppError(AppErrStatus.Unknown, msg);

	static NotFound = (msg?: string) => new AppError(AppErrStatus.NotFound, msg);

	static Unauthorized = (msg?: string) =>
		new AppError(AppErrStatus.Unauthorized, msg);

	static InvalidData = (msg?: string) =>
		new AppError(AppErrStatus.InvalidData, msg);

	static InvalidOperation = (msg?: string) =>
		new AppError(AppErrStatus.InvalidOperation, msg);

	static AlreadyExists = (msg?: string) =>
		new AppError(AppErrStatus.AlreadyExists, msg);

	static Generic = (msg: string) => new AppError(AppErrStatus.Generic, msg);

	static fromError = (e: Error) =>
		new AppError(AppErrStatus.Generic, e.message);
}
