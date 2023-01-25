import {
  RepositoryResult,
  DatabaseConnectivityError,
  AlreadyExistsError,
  NotFoundError,
  Logger,
  Unit,
  UnitResult,
  Monadic,
} from '@carbonteq/hexapp';
import { IShortUrl, ShortUrlEntity } from '@domain/entities/short-url.entity';
import {
  ShortUrlAlreadyExists,
  ShortUrlNotFound,
} from '@domain/entities/short-url.exceptions';
import { ShortUrlRepository } from '@domain/entities/short-url.repository';
import { Injectable, Provider } from '@nestjs/common';
import { Ok, Err } from 'oxide.ts';

@Injectable()
class ShortUrlRepoInMemory extends ShortUrlRepository {
  private readonly db: Map<IShortUrl['shortId'], IShortUrl>;

  constructor(private readonly logger: Logger) {
    super();

    logger.setContext(ShortUrlRepoInMemory.name);

    this.db = new Map();
  }

  async fetchByShortId(
    shortId: string,
  ): Promise<RepositoryResult<ShortUrlEntity, ShortUrlNotFound>> {
    const e = this.db.get(shortId);

    if (e === undefined) {
      return Err(new ShortUrlNotFound(shortId));
    }

    return Ok(ShortUrlEntity.from(e));
  }

  async deleteByShortId(
    shortId: string,
  ): Promise<RepositoryResult<ShortUrlEntity, ShortUrlNotFound>> {
    const ent = await this.fetchById(shortId);

    Monadic.do(ent, (_) => {
      this.db.delete(shortId);
    });

    return ent;
  }

  async existsByShortId(shortId: string): Promise<RepositoryResult<boolean>> {
    const exists = this.db.has(shortId);

    return Ok(exists);
  }

  async fetchAll(): Promise<RepositoryResult<ShortUrlEntity[]>> {
    const all = Array.from(this.db.values()).map(ShortUrlEntity.from);

    return Ok(all);
  }

  async insert(
    entity: ShortUrlEntity,
  ): Promise<RepositoryResult<ShortUrlEntity, ShortUrlAlreadyExists>> {
    const serialized = entity.serialize();
    const id = serialized.shortId;

    if (this.db.has(id)) {
      return Err(new ShortUrlAlreadyExists(id));
    }

    this.db.set(id, serialized);

    return Ok(ShortUrlEntity.from(serialized));
  }

  async update(
    entity: ShortUrlEntity,
  ): Promise<RepositoryResult<ShortUrlEntity, ShortUrlNotFound>> {
    const serialized = entity.serialize();
    const id = serialized.shortId;

    if (!this.db.has(id)) {
      return Err(new ShortUrlNotFound(id));
    }

    this.db.set(id, serialized);

    return Ok(ShortUrlEntity.from(serialized));
  }
}

export const ShortUrlRepoProvider: Provider<ShortUrlRepository> = {
  provide: ShortUrlRepository,
  useClass: ShortUrlRepoInMemory,
};
