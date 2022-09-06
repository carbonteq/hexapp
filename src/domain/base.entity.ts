import { randomUUID } from 'node:crypto';
import type { DateTime, UUID } from './types';

export interface IEntity {
  Id: UUID;
  createdAt: DateTime;
  updatedAt: DateTime;
}

export type IEntityForUpdate = Pick<IEntity, 'updatedAt'>;

export abstract class BaseEntity implements IEntity {
  readonly Id: UUID = randomUUID();
  readonly createdAt: Date;
  private _updatedAt: Date;

  protected constructor(opts?: Partial<IEntity>) {
    this.Id = opts?.Id ?? randomUUID();
    this.createdAt = opts?.createdAt ?? new Date();
    this._updatedAt = opts?.updatedAt ?? this.createdAt; // equals createdAt by default
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  markUpdated(): void {
    this._updatedAt = new Date();
  }

  protected forUpdate(): IEntityForUpdate {
    return { updatedAt: this._updatedAt };
  }
}
