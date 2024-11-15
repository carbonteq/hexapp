import * as assert from "node:assert";
import { describe, it } from "node:test";
import { setTimeout } from "node:timers/promises";
import { UUID } from "@/domain/refined.types.js";
import {
  TestEntity,
  type TestEntitySerialized,
} from "../dummy-objects/test.entity.js";

const getCurrentDate = () => new Date();

describe("base entity", () => {
  describe("create with default opts", () => {
    const ent = TestEntity.create();

    it("base entity props are present and of correct type", () => {
      assert.ok(ent.id !== undefined);
      assert.ok(typeof ent.id === "string");

      assert.ok(ent.createdAt !== undefined);
      assert.ok(ent.createdAt instanceof Date);

      assert.ok(ent.updatedAt !== undefined);
      assert.ok(ent.updatedAt instanceof Date);

      assert.deepStrictEqual(ent.updatedAt, ent.createdAt);
    });

    it("serialize method returns SerializedEntity object", () => {
      const serializedEnt = ent.serialize();
      const expectedObj: TestEntitySerialized = {
        id: ent.id,
        createdAt: ent.createdAt,
        updatedAt: ent.updatedAt,
        random: ent.random,
      };

      assert.deepStrictEqual(serializedEnt, expectedObj);
    });

    it("ids are not the same when multiple created", () => {
      const ent2 = TestEntity.create();
      const ent3 = TestEntity.create();

      assert.ok(ent2.id !== undefined);
      assert.ok(ent3.id !== undefined);
      assert.notStrictEqual(ent2.id, ent3.id);
    });
  });

  describe("create with given data (like in a repo)", () => {
    const id = UUID.init();
    const random = 23;
    const createdAt = getCurrentDate();
    const updatedAt = getCurrentDate();

    const ent = TestEntity.fromSerialized({
      id,
      createdAt,
      updatedAt,
      random,
    });

    it("matches the given data", () => {
      assert.strictEqual(ent.id, id);
      assert.strictEqual(ent.createdAt, createdAt);
      assert.strictEqual(ent.updatedAt, updatedAt);
      assert.strictEqual(ent.random, random);
    });
  });

  it("markUpdated updates updatedAt", async () => {
    const ent = TestEntity.create();
    await setTimeout(1); // to add delay between creation and update

    assert.deepStrictEqual(ent.updatedAt, ent.createdAt);

    ent.updateRandomly();

    assert.ok(
      ent.updatedAt instanceof Date &&
        ent.updatedAt.getTime() > ent.createdAt.getTime(),
    );
  });
});
