import { BaseRepository, UUID } from '@carbonteq/hexapp/domain';
import { TestEntity } from './test.entity';
import { TestEntAlreadyExists, TestEntNotFound } from './test.exception';

export abstract class TestRepository extends BaseRepository<TestEntity> {
	// "Removing" this function from the interface, making sure it's never called
	fetchAll(): never {
		throw new Error('must not be called');
	}
}

// Using extends allows us to use the superclass methods
export class DummyTestRepository extends TestRepository {
	private readonly db: Map<UUID, TestEntity> = new Map();

	async fetchById(Id: string): Promise<TestEntity> {
		const val = this.db.get(Id);

		if (!val) {
			throw new TestEntNotFound(Id);
		}

		return val;
	}

	async insert(entity: TestEntity): Promise<TestEntity> {
		const id = entity.Id;

		const val = this.db.get(id);

		if (val) {
			throw new TestEntAlreadyExists(id);
		}

		this.db.set(id, entity);

		return entity;
	}

	async update(entity: TestEntity): Promise<TestEntity> {
		await this.fetchById(entity.Id); // it must be there to be updated

		this.db.set(entity.Id, entity);

		return entity;
	}

	async deleteById(Id: string): Promise<TestEntity> {
		const ent = await this.fetchById(Id);

		this.db.delete(Id);

		return ent;
	}

	async existsById(Id: string): Promise<boolean> {
		return this.db.has(Id);
	}
}
