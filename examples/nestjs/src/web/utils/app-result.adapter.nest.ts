import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  NotImplementedException,
  ServiceUnavailableException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import {
  AppResult,
  AppErrStatus,
  DtoValidationError,
  assertUnreachable,
} from '@carbonteq/hexapp';

export interface HttpResponseData<T> {
  data: T;
}

export class HttpResponse {
  static fromAppResult<T>(result: AppResult<T>): T {
    if (result.isOk()) {
      return result.unwrap();
    }

    const err = result.unwrapErr();
    const errorMessage = err.message;

    switch (err.status) {
      case AppErrStatus.Unauthorized:
        throw new UnauthorizedException(errorMessage);
      case AppErrStatus.InvalidData:
        throw new UnprocessableEntityException(errorMessage);
      case AppErrStatus.AlreadyExists:
        throw new ConflictException(errorMessage);
      case AppErrStatus.NotFound:
        throw new NotFoundException(errorMessage);
      case AppErrStatus.InvalidOperation:
        throw new BadRequestException(errorMessage);
      case AppErrStatus.ExternalServiceFailure:
        throw new ServiceUnavailableException(
          `ExternalAPIFailure: ${errorMessage}`,
        );
      case AppErrStatus.Generic:
        throw new InternalServerErrorException(errorMessage);
      default:
        assertUnreachable(err.status);
        throw new NotImplementedException(
          `Well, this is embarrassing. We don't know what error this is: "${errorMessage}"`,
        );
    }
  }

  static fromError(err: unknown) {
    if (err instanceof DtoValidationError) {
      return new UnprocessableEntityException(err.message);
    }

    return err;
  }
}
