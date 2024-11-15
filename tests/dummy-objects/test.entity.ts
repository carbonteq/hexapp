import { randomInt } from "node:crypto";
import {
	BaseEntity,
	type IEntity,
	type SerializedEntity,
} from "@/domain/base.entity.js";

export interface ITestEntity extends IEntity {
	random: number;
}

export interface TestEntitySerialized extends SerializedEntity {
	random: number;
}

export class TestEntity extends BaseEntity implements ITestEntity {
	static readonly MAX_RANDOM = 5000;
	static readonly MIN_RANDOM = 13;

	private _random: number; // as `random` is public, it must be readonly to prevent tampering from outside

	private constructor(random?: ITestEntity["random"]) {
		super();

		this._random = random ?? TestEntity.getRandomNumber();
	}

	private static getRandomNumber(): number {
		return randomInt(TestEntity.MIN_RANDOM, TestEntity.MAX_RANDOM + 1);
	}

	static create(): TestEntity {
		return new TestEntity();
	}

	static from(other: ITestEntity): TestEntity {
		const e = new TestEntity(other.random);
		e._copyBaseProps(other);
		return e;
	}

	static fromSerialized(other: TestEntitySerialized) {
		const e = new TestEntity(other.random);

		return e._fromSerialized(other);
	}

	get random() {
		return this._random;
	}

	set random(num) {
		this._random = num;

		this.markUpdated();
	}

	updateRandomly() {
		this._random = TestEntity.getRandomNumber();
		this.markUpdated();
	}

	serialize(): TestEntitySerialized {
		return { ...super._serialize(), random: this._random };
	}
}
