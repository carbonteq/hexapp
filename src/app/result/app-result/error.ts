import { AppResultErrStatus } from './status';

export class AppResultError {
	readonly msg: string;
	private constructor(readonly status: AppResultErrStatus, message?: string) {
		this.msg = `AppResult<${status}>`;

		if (message) {
			this.msg += `: "${message}"`;
		}
	}

	static Unknown = (msg?: string): AppResultError =>
		new AppResultError(AppResultErrStatus.Unknown, msg);

	static NotFound = (msg?: string) =>
		new AppResultError(AppResultErrStatus.NotFound, msg);

	static Unauthorized = (msg?: string) =>
		new AppResultError(AppResultErrStatus.Unauthorized, msg);

	static InvalidData = (msg?: string) =>
		new AppResultError(AppResultErrStatus.InvalidData, msg);

	static InvalidOperation = (msg?: string) =>
		new AppResultError(AppResultErrStatus.InvalidOperation, msg);

	static AlreadyExists = (msg?: string) =>
		new AppResultError(AppResultErrStatus.AlreadyExists, msg);
}
