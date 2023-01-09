import { Err } from 'oxide.ts';
import {
	MockRepository,
	DatabaseConnectivityError,
	RepositoryResult,
} from '../../lib';
import { TestEntity } from './test.entity';

export class DummyTestRepository extends MockRepository<TestEntity> {
	constructor() {
		super();
	}

	fetchAll(): Promise<
		RepositoryResult<TestEntity[], DatabaseConnectivityError>
	> {
		return Promise.resolve(
			Err(new DatabaseConnectivityError("couldn't connect to database")),
		);
	}
}
