import { AlreadyExistsError, NotFoundError } from '@carbonteq/hexapp';

export class ShortUrlNotFound extends NotFoundError {
  constructor(shortId: string) {
    super(`URL with ShortId<${shortId}> not found`);
  }
}

export class ShortUrlAlreadyExists extends AlreadyExistsError {
  constructor(shortId: string) {
    super(`URL with ShortId<${shortId}> already exists in DB`);
  }
}
