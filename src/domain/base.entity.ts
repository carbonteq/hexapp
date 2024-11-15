import { DateTime, UUID } from "./refined.types.js";

export interface IEntity {
  readonly id: UUID;
  readonly createdAt: DateTime;
  readonly updatedAt: DateTime;
}

export interface SerializedEntity {
  readonly id: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export type IEntityForUpdate = Pick<IEntity, "updatedAt">;

export abstract class BaseEntity implements IEntity {
  #id: UUID;
  #createdAt: DateTime;
  #updatedAt: DateTime;

  protected constructor() {
    this.#id = UUID.init();
    this.#createdAt = DateTime.now();
    this.#updatedAt = this.#createdAt;
  }

  get id(): UUID {
    return this.#id;
  }

  get createdAt(): DateTime {
    return this.#createdAt;
  }

  get updatedAt(): DateTime {
    return this.#updatedAt;
  }

  protected markUpdated(): void {
    this.#updatedAt = DateTime.now();
  }

  protected forUpdate(): IEntityForUpdate {
    return { updatedAt: this.#updatedAt };
  }

  // for construction within safe boundaries of the domain
  protected _copyBaseProps(other: IEntity) {
    this.#id = other.id;
    this.#createdAt = DateTime.from(other.createdAt);
    this.#updatedAt = DateTime.from(other.updatedAt);
  }

  protected _fromSerialized(other: Readonly<SerializedEntity>) {
    this.#id = UUID.fromTrusted(other.id); // only to simplify fromSerialized implementation on developer side
    this.#createdAt = DateTime.from(other.createdAt);
    this.#updatedAt = DateTime.from(other.updatedAt);

    return this;
  }

  protected _serialize(): SerializedEntity {
    return {
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  //@ts-ignore
  abstract serialize();
}

export type SimpleSerialized<
  EntityInterface extends IEntity,
  T extends keyof EntityInterface = keyof IEntity,
> = SerializedEntity & Omit<EntityInterface, T | keyof IEntity>;
