import 'jest-extended';
import { setTimeout } from 'node:timers/promises';
import { TestEntity, ITestEntity } from '../dummy-objects/test.entity';

const getCurrentDate = () => new Date();

describe('base entity', () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});

	describe('create with default opts', () => {
		const ent = TestEntity.create();

		it('base entity props are present and of correct type', () => {
			expect(ent.Id).toBeDefined();
			expect(ent.Id).toBeString();

			expect(ent.createdAt).toBeDefined();
			expect(ent.createdAt).toBeDate();

			expect(ent.updatedAt).toBeDefined();
			expect(ent.updatedAt).toBeDate();

			expect(ent.updatedAt).toEqual(ent.createdAt);
		});

		it('serialize method returns IEntity object', () => {
			const serializedEnt = ent.serialize();
			const expectedObj: ITestEntity = {
				Id: ent.Id,
				createdAt: ent.createdAt,
				updatedAt: ent.updatedAt,
				random: ent.random,
			};

			expect(serializedEnt).toStrictEqual(expectedObj);
		});

		it('ids are not the same when multiple created', () => {
			const ent2 = TestEntity.create();
			const ent3 = TestEntity.create();

			expect(ent2.Id).toBeDefined();
			expect(ent3.Id).toBeDefined();
			expect(ent2.Id).not.toEqual(ent3.Id);
		});
	});

	describe('create with given data (like in a repo)', () => {
		const Id = 'abc';
		const random = 23;
		const createdAt = getCurrentDate();
		const updatedAt = getCurrentDate();

		const ent = TestEntity.from({
			Id,
			createdAt,
			updatedAt,
			random,
		});

		it('matches the given data', () => {
			expect(ent.Id).toBe(Id);
			expect(ent.createdAt).toBe(createdAt);
			expect(ent.updatedAt).toBe(updatedAt);
			expect(ent.random).toBe(random);
		});
	});

	it('markUpdated updates updatedAt', async () => {
		const ent = TestEntity.create();
		await setTimeout(1); // to add delay between creation and update

		expect(ent.updatedAt).toEqual(ent.createdAt);

		ent.updateRandomly();

		expect(ent.updatedAt).toBeAfter(ent.createdAt);
	});
});
