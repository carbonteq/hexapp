import type { BaseEntity } from './base.entity';

export abstract class BaseRepository<T extends BaseEntity> {
  abstract fetchById(Id: BaseEntity['Id']): Promise<T>;
  abstract fetchAll(): Promise<T>;

  abstract insert(entity: T): Promise<T>;

  abstract update(entity: T): Promise<T>;

  abstract deleteById(Id: BaseEntity['Id']): Promise<T>;

  abstract existsById(Id: BaseEntity['Id']): Promise<boolean>;

  async exists(entity: T): Promise<boolean> {
    return this.existsById(entity.Id);
  }

  async delete(entity: T): Promise<T> {
    return this.deleteById(entity.Id);
  }
}

export abstract class BaseRepositoryExtended<
  T extends BaseEntity,
> extends BaseRepository<T> {
  abstract fetchBy<U extends keyof T>(prop: U, val: T[U]): Promise<T>; // val: ValueForProp<T, U>
  abstract existsBy<U extends keyof T>(prop: U, val: T[U]): Promise<boolean>;
  abstract deleteBy<U extends keyof T>(prop: U, val: T[U]): Promise<T>;
}

// interface Some extends BaseEntity{some: boolean}
//
// class BBB implements BaseRepositoryExtended<Some>{
//     fetchBy<U extends keyof Some>(prop: U, val: Some[U]): Promise<Some> {
//         throw new Error('Method not implemented.');
//     }
//     existsBy<U extends keyof Some>(prop: U, val: Some[U]): Promise<boolean> {
//         throw new Error('Method not implemented.');
//     }
//     fetchById(Id: string): Promise<Some> {
//         throw new Error('Method not implemented.');
//     }
//     fetchAll(): Promise<Some> {
//         throw new Error('Method not implemented.');
//     }
//     insert(entity: Some): Promise<Some> {
//         throw new Error('Method not implemented.');
//     }
//     update(entity: Some): Promise<Some> {
//         throw new Error('Method not implemented.');
//     }
//     existsById(Id: string): Promise<boolean> {
//         throw new Error('Method not implemented.');
//     }
//     exists(entity: Some): Promise<boolean> {
//         throw new Error('Method not implemented.');
//     }
// }

// const b = new BBB()

// b.existsBy('updatedAt', 2) // gives an error
