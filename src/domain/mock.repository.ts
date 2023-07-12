import { BaseEntity } from './base.entity';
import { AlreadyExistsError, NotFoundError } from './base.errors';
import { BaseRepository, RepositoryResult } from './base.repository';
import { Paginated, PaginationOptions } from './pagination';
import { Result } from '@carbonteq/fp';

export class MockNotFoundError extends NotFoundError {
  constructor(entityId: BaseEntity['Id']) {
    super(`entity with ID<${entityId}> not found by mock repository`);
  }
}

export class MockAlreadyExistsError extends AlreadyExistsError {
  constructor(entityId: BaseEntity['Id']) {
    super(`entity with ID<${entityId}> already exists in mock repository`);
  }
}

type GetSerialized<Ent extends BaseEntity> = ReturnType<Ent['serialize']>;

export abstract class MockRepository<
  T extends BaseEntity,
> extends BaseRepository<T> {
  db: Map<T['Id'], GetSerialized<T>>;

  protected constructor() {
    super();
    this.db = new Map();
  }

  fetchById(Id: T['Id']): Promise<RepositoryResult<T, MockNotFoundError>> {
    const optEnt = this.db.get(Id);
    let res: Result<GetSerialized<T>, MockNotFoundError>;

    if (optEnt) {
      res = Result.Ok(optEnt);
    } else {
      res = Result.Err(new MockNotFoundError(Id));
    }

    return Promise.resolve(res);
  }

  fetchAll(): Promise<RepositoryResult<T[]>> {
    return Promise.resolve(Result.Ok(Array.from(this.db.values())));
  }

  insert(entity: T): Promise<RepositoryResult<T, MockAlreadyExistsError>> {
    let res: Result<T, AlreadyExistsError>;

    if (this.db.has(entity.Id)) {
      res = Result.Err(new MockAlreadyExistsError(entity.Id));
    } else {
      this.db.set(entity.Id, entity.serialize());
      res = Result.Ok(entity);
    }

    return Promise.resolve(res);
  }

  fetchPaginated(
    options: PaginationOptions,
  ): Promise<RepositoryResult<Paginated<T>>> {
    const all = Array.from(this.db.values());

    return Promise.resolve(Result.Ok(Paginated.fromAll(all, options)));
  }

  update(entity: T): Promise<RepositoryResult<T, MockNotFoundError>> {
    let res: Result<T, MockNotFoundError>;

    if (this.db.has(entity.Id)) {
      this.db.set(entity.Id, entity.serialize());
      res = Result.Ok(entity);
    } else {
      res = Result.Err(new MockNotFoundError(entity.Id));
    }

    return Promise.resolve(res);
  }

  async deleteById(
    Id: T['Id'],
  ): Promise<RepositoryResult<T, MockNotFoundError>> {
    const res = await this.fetchById(Id);

    if (res.isOk()) {
      this.db.delete(Id);
    }

    return res;
  }

  existsById(Id: T['Id']): Promise<RepositoryResult<boolean>> {
    return Promise.resolve(Result.Ok(this.db.has(Id)));
  }
}
