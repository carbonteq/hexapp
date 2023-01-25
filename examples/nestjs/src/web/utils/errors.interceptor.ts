import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, Observable, throwError } from 'rxjs';
import { HttpResponse } from './app-result.adapter.nest';
import { Logger } from '@carbonteq/hexapp';

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  constructor(private readonly logger: Logger) {
    logger.setContext(ErrorsInterceptor.name);
  }

  intercept(
    _context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    return next.handle().pipe(
      catchError((err) => {
        this.logger.error(err);

        return throwError(() => HttpResponse.fromError(err));
      }),
    );
  }
}
