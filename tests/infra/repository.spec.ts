import * as assert from "node:assert";
import { beforeEach, describe, it } from "node:test";
import { AppResult } from "@/app/result/result.js";
import { AppErrStatus } from "@/app/result/status.js";
import type { MockRepository } from "@/infra/db/mock.repository.ts";
import { TestEntity } from "../dummy-objects/test.entity.js";
import { DummyTestRepository } from "../dummy-objects/test.repository.js";

describe("test repository", () => {
	let repo: MockRepository<TestEntity>;
	let ent1: TestEntity;
	let ent2: TestEntity;

	beforeEach(() => {
		repo = new DummyTestRepository();
		ent1 = TestEntity.create();
		ent2 = TestEntity.create();
		repo.insert(ent1);
	});

	describe("valid operations", () => {
		it("on fetch", async () => {
			const res = await repo.fetchById(ent1.id);

			assert.deepEqual(res.unwrap(), ent1.serialize());
		});

		it("on insert", async () => {
			const res = await repo.insert(ent2);

			assert.equal(res.unwrap(), ent2);
		});

		it("on update", async () => {
			const ent1Changed = TestEntity.from(ent1);
			ent1Changed.updateRandomly();

			const res = await repo.update(ent1Changed);

			const entReturned = res.unwrap();

			assert.equal(entReturned, ent1Changed);
			assert.equal(entReturned?.id, ent1.id);
			assert.notEqual(entReturned?.random, ent1.random);
		});

		it("on delete", async () => {
			const res = await repo.deleteById(ent1.id);

			assert.deepEqual(res.unwrap(), ent1.serialize());
		});
	});

	describe("bubbling errors with app result tryFromPromise", () => {
		it("on fetch", async () => {
			const fetchResult = await repo.fetchById(ent2.id);

			const res = AppResult.fromResult(fetchResult);

			assert.equal(res.isOk(), false);

			const err = res.unwrapErr();
			assert.ok(err !== undefined);
			assert.equal(err.status, AppErrStatus.NotFound);
		});

		it("on insert", async () => {
			const opRes = await repo.insert(ent1);
			const res = AppResult.fromResult(opRes);

			assert.equal(res.unwrapErr().status, AppErrStatus.AlreadyExists);
		});

		it("on update", async () => {
			ent2.updateRandomly();
			const opRes = await repo.update(ent2);

			const res = AppResult.fromResult(opRes);

			assert.equal(res.unwrapErr().status, AppErrStatus.NotFound);
		});

		it("on delete", async () => {
			const opRes = await repo.deleteById(ent2.id);

			const res = AppResult.fromResult(opRes);

			assert.equal(res.unwrapErr().status, AppErrStatus.NotFound);
		});
	});
});
