import {
  AlreadyExistsError,
  BaseRepository,
  InvalidOperation,
  NotFoundError,
  RepositoryResult,
  UUID,
} from '@carbonteq/hexapp';
import { Err } from 'oxide.ts';
import { ShortUrlEntity } from './short-url.entity';
import {
  ShortUrlAlreadyExists,
  ShortUrlNotFound,
} from './short-url.exceptions';

export abstract class ShortUrlRepository extends BaseRepository<ShortUrlEntity> {
  async fetchById(_Id: UUID): Promise<RepositoryResult<ShortUrlEntity>> {
    return Err(new InvalidOperation('fetchById not allowed for ShortUrl'));
  }

  async deleteById(_Id: UUID): Promise<RepositoryResult<ShortUrlEntity>> {
    return Err(new InvalidOperation('fetchById not allowed for ShortUrl'));
  }

  async existsById(_Id: UUID): Promise<RepositoryResult<boolean>> {
    return Err(new InvalidOperation('fetchById not allowed for ShortUrl'));
  }

  abstract fetchByShortId(
    shortId: string,
  ): Promise<RepositoryResult<ShortUrlEntity, ShortUrlNotFound>>;
  abstract deleteByShortId(
    shortId: string,
  ): Promise<RepositoryResult<ShortUrlEntity, ShortUrlNotFound>>;
  abstract existsByShortId(shortId: string): Promise<RepositoryResult<boolean>>;
  abstract insert(
    entity: ShortUrlEntity,
  ): Promise<RepositoryResult<ShortUrlEntity, ShortUrlAlreadyExists>>;
  abstract update(
    entity: ShortUrlEntity,
  ): Promise<RepositoryResult<ShortUrlEntity, ShortUrlNotFound>>;
}
