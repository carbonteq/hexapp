import { Result } from "@carbonteq/fp";
import { NotFoundError, type RepositoryResult } from "@/domain/index.js";
import type { TestEntity } from "./test.entity.js";
import { MockRepository } from "@/infra/db/mock.repository.js";

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
