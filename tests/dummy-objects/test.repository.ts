import { NotFoundError, type RepositoryResult } from "@/domain/index.js";
import { MockRepository } from "@/infra/db/mock.repository.js";
import { Result } from "@carbonteq/fp";
import type { TestEntity } from "./test.entity.js";

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
