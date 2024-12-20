import type { Result } from "@carbonteq/fp";
import type { BaseEntity } from "../domain/base.entity.ts";
import type {
  AlreadyExistsError,
  InvalidOperation,
  NotFoundError,
} from "../domain/base.errors.ts";
import type { Paginated, PaginationOptions } from "../domain/pagination.ts";

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
  abstract insert(entity: T): Promise<RepositoryResult<T, AlreadyExistsError>>;
  abstract update(entity: T): Promise<RepositoryResult<T, NotFoundError>>;

  fetchAll?(): Promise<RepositoryResult<T[]>>;
  fetchPaginated?(
    options: PaginationOptions,
  ): Promise<RepositoryResult<Paginated<T>>>;
  fetchById?(id: BaseEntity["id"]): Promise<RepositoryResult<T, NotFoundError>>;
  deleteById?(
    Id: BaseEntity["id"],
  ): Promise<RepositoryResult<T, NotFoundError>>;
  fetchBy?<U extends keyof T>(
    prop: U,
    val: T[U],
  ): Promise<RepositoryResult<T, NotFoundError>>; // val: ValueForProp<T, U>
  existsBy?<U extends keyof T>(
    prop: U,
    val: T[U],
  ): Promise<RepositoryResult<boolean>>;
  deleteBy?<U extends keyof T>(
    prop: U,
    val: T[U],
  ): Promise<RepositoryResult<T, NotFoundError>>;
}
