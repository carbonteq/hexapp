import type { DateTime, UUIDStr } from "./types";
import { UUIDVo } from "./valueObjects/uuid.vo";

export interface IEntity {
	readonly Id: UUIDVo;
	readonly createdAt: DateTime;
	readonly updatedAt: DateTime;
}

export interface SerializedEntity {
	readonly Id: UUIDStr;
	readonly createdAt: DateTime;
	readonly updatedAt: DateTime;
}

export type IEntityForUpdate = Pick<IEntity, "updatedAt">;

export abstract class BaseEntity implements IEntity {
	private _id: UUIDVo = UUIDVo.new();
	private _createdAt: DateTime;
	private _updatedAt: DateTime;

	protected constructor() {
		// this._id = opts?.Id ?? UUIDVo.new();
		// this._createdAt = opts?.createdAt ?? new Date();
		// this._updatedAt = opts?.updatedAt ?? this.createdAt; // equals createdAt by default

		this._id = UUIDVo.new();
		this._createdAt = new Date();
		this._updatedAt = this._createdAt;
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

	// for construction within safe boundaries of the domain
	protected _copyBaseProps(other: IEntity) {
		this._id = other.Id;
		this._createdAt = other.createdAt;
		this._updatedAt = other.updatedAt;
	}

	protected _fromSerialized(other: SerializedEntity) {
		this._id = UUIDVo.fromStrNoValidation(other.Id);
		this._createdAt = other.createdAt;
		this._updatedAt = other.updatedAt;
	}

	protected _serialize(): SerializedEntity {
		return {
			Id: this.Id.serialize(),
			createdAt: this.createdAt,
			updatedAt: this.updatedAt,
		};
	}

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	abstract serialize(): any;
}
