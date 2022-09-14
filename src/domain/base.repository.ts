import type { BaseEntity } from './base.entity';

export abstract class BaseRepository<T extends BaseEntity> {
  abstract fetchById(Id: BaseEntity['Id']): Promise<T>;
  abstract fetchAll(): Promise<T[]>;

  abstract insert(entity: T): Promise<T>;

  abstract update(entity: T): Promise<T>;

  abstract deleteById(Id: BaseEntity['Id']): Promise<T>;

  abstract existsById(Id: BaseEntity['Id']): Promise<boolean>;
}

export abstract class BaseRepositoryExtended<
  T extends BaseEntity,
> extends BaseRepository<T> {
  abstract fetchBy<U extends keyof T>(prop: U, val: T[U]): Promise<T>; // val: ValueForProp<T, U>
  abstract existsBy<U extends keyof T>(prop: U, val: T[U]): Promise<boolean>;
  abstract deleteBy<U extends keyof T>(prop: U, val: T[U]): Promise<T>;
}
