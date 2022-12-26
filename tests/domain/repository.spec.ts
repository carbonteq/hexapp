import {
	DummyTestRepository,
	TestRepository,
} from '../dummy-objects/test.repository';
import { AppResult, AppErrStatus } from '../../lib';
import { TestEntity } from '../dummy-objects/test.entity';

describe('test repository', () => {
	let repo: TestRepository;
	let ent1: TestEntity;
	let ent2: TestEntity;

	beforeEach(() => {
		repo = new DummyTestRepository();
		ent1 = TestEntity.create();
		ent2 = TestEntity.create();
		repo.insert(ent1);
	});

	describe('valid operations', () => {
		it('on fetch', async () => {
			const res = await AppResult.tryFromPromise(repo.fetchById(ent1.Id));

			expect(res.into()).toBe(ent1);
		});

		it('on insert', async () => {
			const res = await AppResult.tryFromPromise(repo.insert(ent2));

			expect(res.into()).toBe(ent2);
		});

		it('on update', async () => {
			const ent1Changed = TestEntity.from(ent1);
			ent1Changed.updateRandomly();

			const res = await AppResult.tryFromPromise(repo.update(ent1Changed));

			const entReturned = res.into();

			expect(entReturned).toBe(ent1Changed);
			expect(entReturned?.Id).toBe(ent1.Id);
			expect(entReturned?.random).not.toBe(ent1.random);
		});

		it('on delete', async () => {
			const res = await AppResult.tryFromPromise(repo.deleteById(ent1.Id));

			expect(res.into()).toBe(ent1);
		});
	});

	describe('bubbling errors with app result tryFromPromise', () => {
		it('on fetch', async () => {
			const res = await AppResult.tryFromPromise(repo.fetchById(ent2.Id));

			expect(res.unwrapErr().status).toBe(AppErrStatus.NotFound);
		});

		it('on insert', async () => {
			const res = await AppResult.tryFromPromise(repo.insert(ent1));

			expect(res.unwrapErr().status).toBe(AppErrStatus.AlreadyExists);
		});

		it('on update', async () => {
			ent2.updateRandomly();
			const res = await AppResult.tryFromPromise(repo.update(ent2));

			expect(res.unwrapErr().status).toBe(AppErrStatus.NotFound);
		});

		it('on delete', async () => {
			const res = await AppResult.tryFromPromise(repo.deleteById(ent2.Id));

			expect(res.unwrapErr().status).toBe(AppErrStatus.NotFound);
		});
	});
});
