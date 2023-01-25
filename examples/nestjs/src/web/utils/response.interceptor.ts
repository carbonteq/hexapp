import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpResponse } from './app-result.adapter.nest';
import { AppResult, Logger } from '@carbonteq/hexapp';

@Injectable()
export class AppResultTransformer<T> implements NestInterceptor<AppResult<T>, T> {
  constructor(private readonly logger: Logger) {
    logger.setContext(AppResultTransformer.name);
  }

  intercept(
    _context: ExecutionContext,
    next: CallHandler<AppResult<T>>,
  ): Observable<T> {
    return next.handle().pipe(
      map((result) => {
        if (result instanceof AppResult) {
          if (result.isErr()) {
            const err = result.unwrapErr();
            this.logger.error(err);
          }

          return HttpResponse.fromAppResult(result);
        }

        return result; // otherwise, return as is
      }),
    );
  }
}
