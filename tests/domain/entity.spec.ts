import { UUID } from "../../lib";
import {
	TestEntity,
	type TestEntitySerialized,
} from "../dummy-objects/test.entity";
import "jest-extended";
import { setTimeout } from "node:timers/promises";

const getCurrentDate = () => new Date();

describe("base entity", () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});

	describe("create with default opts", () => {
		const ent = TestEntity.create();

		it("base entity props are present and of correct type", () => {
			expect(ent.id).toBeDefined();
			expect(ent.id).toBeString();

			expect(ent.createdAt).toBeDefined();
			expect(ent.createdAt).toBeDate();

			expect(ent.updatedAt).toBeDefined();
			expect(ent.updatedAt).toBeDate();

			expect(ent.updatedAt).toEqual(ent.createdAt);
		});

		it("serialize method returns SerializedEntity object", () => {
			const serializedEnt = ent.serialize();
			const expectedObj: TestEntitySerialized = {
				id: ent.id,
				sId: ent.sId,
				createdAt: ent.createdAt,
				updatedAt: ent.updatedAt,
				deletedAt: ent.deletedAt,
				random: ent.random,
			};

			expect(serializedEnt).toStrictEqual(expectedObj);
		});

		it("ids are not the same when multiple created", () => {
			const ent2 = TestEntity.create();
			const ent3 = TestEntity.create();

			expect(ent2.id).toBeDefined();
			expect(ent3.id).toBeDefined();
			expect(ent2.id).not.toEqual(ent3.id);
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
			expect(ent.id).toBe(id);
			expect(ent.createdAt).toBe(createdAt);
			expect(ent.updatedAt).toBe(updatedAt);
			expect(ent.random).toBe(random);
		});
	});

	it("markUpdated updates updatedAt", async () => {
		const ent = TestEntity.create();
		await setTimeout(1); // to add delay between creation and update

		expect(ent.updatedAt).toEqual(ent.createdAt);

		ent.updateRandomly();

		expect(ent.updatedAt).toBeAfter(ent.createdAt);
	});
});
