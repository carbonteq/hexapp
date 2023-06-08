import type { DateTime } from './types';
import { UUIDVo } from './valueObjects/uuid.vo';

export interface IEntity {
  readonly Id: UUIDVo;
  readonly createdAt: DateTime;
  readonly updatedAt: DateTime;
}

export type IEntityForUpdate = Pick<IEntity, 'updatedAt'>;

export abstract class BaseEntity implements IEntity {
  private _id: UUIDVo = UUIDVo.new();
  private _createdAt: DateTime;
  private _updatedAt: DateTime;

  protected constructor(opts?: Partial<IEntity>) {
    this._id = opts?.Id ?? UUIDVo.new();
    this._createdAt = opts?.createdAt ?? new Date();
    this._updatedAt = opts?.updatedAt ?? this.createdAt; // equals createdAt by default
  }

  get Id(): UUIDVo {
    return this._id;
  }

  get createdAt(): DateTime {
    return this._createdAt;
  }

  get updatedAt(): DateTime {
    return this._updatedAt;
  }

  protected markUpdated(): void {
    this._updatedAt = new Date();
  }

  protected forUpdate(): IEntityForUpdate {
    return { updatedAt: this._updatedAt };
  }

  protected _copyBaseProps(other: IEntity) {
    this._id = other.Id;
    this._createdAt = other.createdAt;
    this._updatedAt = other.updatedAt;
  }

  protected _serialize(): IEntity {
    return {
      Id: this.Id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  abstract serialize(): any;
}
