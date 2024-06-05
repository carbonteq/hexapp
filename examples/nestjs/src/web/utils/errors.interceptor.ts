import {
	CallHandler,
	ExecutionContext,
	Injectable,
	NestInterceptor,
} from "@nestjs/common";
import { catchError, Observable, throwError } from "rxjs";
import { HttpResponse } from "./app-result.adapter.nest";
import type { Logger } from "@carbonteq/hexapp";

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
	constructor(private readonly logger: Logger) {
		logger.setContext(ErrorsInterceptor.name);
	}

	intercept(
		_context: ExecutionContext,
		next: CallHandler<unknown>,
	): Observable<unknown> {
		return next.handle().pipe(
			catchError((err: unknown) => {
				this.logger.error(err);

				return throwError(() => HttpResponse.fromError(err));
			}),
		);
	}
}
