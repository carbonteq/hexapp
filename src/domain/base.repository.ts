import type { BaseEntity } from './base.entity';
import {
  AlreadyExistsError,
  InvalidOperation,
  NotFoundError,
} from './base.errors';
import { Result } from '@carbonteq/fp';

export type RepositoryError =
  | NotFoundError
  | AlreadyExistsError
  | InvalidOperation;

type CommonRepoErrors = InvalidOperation;

export type RepositoryResult<T, E = CommonRepoErrors> = Result<
  T,
  E | CommonRepoErrors
>;

export abstract class BaseRepository<T extends BaseEntity> {
  abstract fetchById(
    id: BaseEntity['Id'],
  ): Promise<RepositoryResult<T, NotFoundError>>;

  abstract fetchAll(): Promise<RepositoryResult<T[]>>;

  abstract insert(entity: T): Promise<RepositoryResult<T, AlreadyExistsError>>;

  abstract update(entity: T): Promise<RepositoryResult<T, NotFoundError>>;

  abstract deleteById(
    Id: BaseEntity['Id'],
  ): Promise<RepositoryResult<T, NotFoundError>>;

  abstract existsById(Id: BaseEntity['Id']): Promise<RepositoryResult<boolean>>;
}

export abstract class BaseRepositoryExtended<
  T extends BaseEntity,
> extends BaseRepository<T> {
  abstract fetchBy<U extends keyof T>(
    prop: U,
    val: T[U],
  ): Promise<RepositoryResult<T, NotFoundError>>; // val: ValueForProp<T, U>
  abstract existsBy<U extends keyof T>(
    prop: U,
    val: T[U],
  ): Promise<RepositoryResult<boolean>>;
  abstract deleteBy<U extends keyof T>(
    prop: U,
    val: T[U],
  ): Promise<RepositoryResult<T, NotFoundError>>;

  async fetchById(id: T['Id']): Promise<RepositoryResult<T, NotFoundError>> {
    return await this.fetchBy('Id', id);
  }

  async existsById(id: T['Id']): Promise<RepositoryResult<boolean>> {
    return await this.existsBy('Id', id);
  }

  async deleteById(id: T['Id']): Promise<RepositoryResult<T, NotFoundError>> {
    return await this.deleteBy('Id', id);
  }
}
