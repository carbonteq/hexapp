import {
	BaseRepository,
	DatabaseConnectivityError,
	RepositoryResult,
} from './base.repository';
import { BaseEntity } from './base.entity';
import { NotFoundError, AlreadyExistsError } from './base.exception';
import { Err, Ok, Result } from 'oxide.ts';

export class MockNotFoundError extends NotFoundError {
	constructor(entityId: BaseEntity['Id']) {
		super(`entity with ID<${entityId}> not found by mock repository`);
	}
}

export class MockAlreadyExistsError extends AlreadyExistsError {
	constructor(entityId: BaseEntity['Id']) {
		super(`entity with ID<${entityId}> already exists in mock repository`);
	}
}

type GetSerialize<Ent extends BaseEntity> = ReturnType<Ent['serialize']>;

export abstract class MockRepository<
	T extends BaseEntity,
> extends BaseRepository<T> {
	db: Map<T['Id'], GetSerialize<T>>;

	protected constructor() {
		super();
		this.db = new Map();
	}

	fetchById(Id: T['Id']): Promise<RepositoryResult<T, MockNotFoundError>> {
		const optEnt = this.db.get(Id);
		const res = Result.nonNull(optEnt).mapErr((_) => new MockNotFoundError(Id));

		return Promise.resolve(res);
	}

	fetchAll(): Promise<RepositoryResult<T[]>> {
		return Promise.resolve(Ok(Object.values(this.db)));
	}

	insert(entity: T): Promise<RepositoryResult<T, MockAlreadyExistsError>> {
		let res: Result<T, AlreadyExistsError>;

		if (this.db.has(entity.Id)) {
			res = Err(new MockAlreadyExistsError(entity.Id));
		} else {
			this.db.set(entity.Id, entity.serialize());
			res = Ok(entity);
		}

		return Promise.resolve(res);
	}

	update(entity: T): Promise<RepositoryResult<T, MockNotFoundError>> {
		let res: Result<T, MockNotFoundError>;
		if (this.db.has(entity.Id)) {
			this.db.set(entity.Id, entity.serialize());
			res = Ok(entity);
		} else {
			res = Err(new MockNotFoundError(entity.Id));
		}

		return Promise.resolve(res);
	}

	async deleteById(
		Id: T['Id'],
	): Promise<RepositoryResult<T, MockNotFoundError>> {
		const res = await this.fetchById(Id);

		if (res.isOk()) {
			this.db.delete(Id);
		}

		return res;
	}

	existsById(Id: T['Id']): Promise<boolean> {
		return Promise.resolve(this.db.has(Id));
	}
}
