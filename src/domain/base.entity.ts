import { DateTime, UUID } from "./refined.types";

export interface IEntity {
	readonly sId: number;
	readonly id: UUID;
	readonly createdAt: DateTime;
	readonly updatedAt: DateTime;
	readonly deletedAt: DateTime | null;
}

export interface SerializedEntity {
	readonly id: string;
	readonly createdAt: Date;
	readonly updatedAt: Date;
	readonly deletedAt: Date | null;
	readonly sId: number;
}

export type IEntityForUpdate = Pick<IEntity, "updatedAt">;

export abstract class BaseEntity implements IEntity {
	#sId: number;
	#id: UUID;
	#createdAt: DateTime;
	#updatedAt: DateTime;
	#deletedAt: DateTime | null;

	protected constructor() {
		this.#sId = 1;
		this.#id = UUID.init();
		this.#createdAt = DateTime.now();
		this.#updatedAt = this.#createdAt;
		this.#deletedAt = null;
	}

	get id(): UUID {
		return this.#id;
	}

	get sId(): number {
		return this.#sId;
	}

	get createdAt(): DateTime {
		return this.#createdAt;
	}

	get updatedAt(): DateTime {
		return this.#updatedAt;
	}

	get deletedAt(): DateTime | null {
		return this.#deletedAt;
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
		this.#sId = other.sId;
		this.#createdAt = DateTime.from(other.createdAt);
		this.#updatedAt = DateTime.from(other.updatedAt);
		this.#deletedAt = other.deletedAt ? DateTime.from(other.deletedAt) : null;
	}

	protected _fromSerialized(other: Readonly<SerializedEntity>) {
		this.#sId = other.sId;
		this.#id = UUID.fromTrusted(other.id); // only to simplify fromSerialized implementation on developer side
		this.#createdAt = DateTime.from(other.createdAt);
		this.#updatedAt = DateTime.from(other.updatedAt);
		this.#deletedAt = other.deletedAt ? DateTime.from(other.deletedAt) : null;

		return this;
	}

	protected _serialize(): SerializedEntity {
		return {
			id: this.id,
			sId: this.sId,
			createdAt: this.createdAt,
			updatedAt: this.updatedAt,
			deletedAt: this.deletedAt,
		};
	}

	//@ts-ignore
	abstract serialize();
}

export type SimpleSerialized<
	EntityInterface extends IEntity,
	T extends keyof EntityInterface = keyof IEntity,
> = SerializedEntity & Omit<EntityInterface, T | keyof IEntity>;
