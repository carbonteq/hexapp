import { Result } from "@carbonteq/fp";
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
	// biome-ignore lint/complexity/noUselessConstructor: <explanation>
	constructor() {
		super();
	}

	fetchAll(): Promise<RepositoryResult<TestEntity[]>> {
		return Promise.resolve(Result.Err(new DummyRepoError()));
	}
}
