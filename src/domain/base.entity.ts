import { UUID } from "./nominal.types";

export interface IEntity {
	readonly Id: UUID;
	readonly createdAt: Date;
	readonly updatedAt: Date;
}

export type SerializedEntity = IEntity;

export type IEntityForUpdate = Pick<IEntity, "updatedAt">;

export abstract class BaseEntity implements IEntity {
	#id: UUID;
	#createdAt: Date;
	#updatedAt: Date;

	protected constructor() {
		this.#id = UUID.init();
		this.#createdAt = new Date();
		this.#updatedAt = this.#createdAt;
	}

	get Id(): UUID {
		return this.#id;
	}

	get createdAt(): Date {
		return this.#createdAt;
	}

	get updatedAt(): Date {
		return this.#updatedAt;
	}

	protected markUpdated(): void {
		console.debug("Marking as updated");
		this.#updatedAt = new Date();
	}

	protected forUpdate(): IEntityForUpdate {
		return { updatedAt: this.#updatedAt };
	}

	// for construction within safe boundaries of the domain
	protected _copyBaseProps(other: IEntity) {
		this.#id = other.Id;
		this.#createdAt = other.createdAt;
		this.#updatedAt = other.updatedAt;
	}

	protected _fromSerialized(other: Readonly<SerializedEntity>) {
		this.#id = other.Id;
		this.#createdAt = other.createdAt;
		this.#updatedAt = other.updatedAt;
	}

	protected _serialize(): SerializedEntity {
		return {
			Id: this.Id,
			createdAt: this.createdAt,
			updatedAt: this.updatedAt,
		};
	}

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	abstract serialize(): any;
}
