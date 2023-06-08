import { SerializedEntity, BaseEntity, IEntity } from '../../lib';
import { randomInt } from 'node:crypto';

export interface ITestEntity extends IEntity {
  random: number;
}

export interface TestEntitySerialized extends SerializedEntity {
  random: number;
}

export class TestEntity extends BaseEntity implements ITestEntity {
  static readonly MAX_RANDOM = 42;
  static readonly MIN_RANDOM = 13;

  private _random: number; // as `random` is public, it must be readonly to prevent tampering from outside

  private constructor(opts?: ITestEntity) {
    super();

    this._random = opts?.random ?? TestEntity.getRandomNumber();
  }

  private static getRandomNumber(): number {
    return randomInt(TestEntity.MIN_RANDOM, TestEntity.MAX_RANDOM + 1);
  }

  static create(): TestEntity {
    return new TestEntity();
  }

  static from(other: ITestEntity): TestEntity {
    const e = new TestEntity(other);
    e._copyBaseProps(other);
    return e;
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
