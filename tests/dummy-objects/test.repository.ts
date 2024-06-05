import { Result } from "@carbonteq/fp";
import { InvalidOperation } from "@carbonteq/hexapp";
import {
	MockRepository,
	NotFoundError,
	type RepositoryResult,
} from "../../lib";
import type { TestEntity } from "./test.entity";

export class DummyRepoError extends NotFoundError {
	constructor() {
		super("dummy not found error");
	}
}

export class DummyTestRepository extends MockRepository<TestEntity> {
	fetchAll(): Promise<RepositoryResult<TestEntity[]>> {
		return Promise.resolve(Result.Err(new DummyRepoError()));
	}
}
