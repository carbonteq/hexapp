import { Result } from "@carbonteq/fp";
import { NotFoundError, type RepositoryResult } from "@/domain/index.js";
import { MockRepository } from "@/infra/db/mock.repository.js";
import type { TestEntity } from "./test.entity.js";

export class DummyRepoError extends NotFoundError {
  constructor() {
    super("dummy not found error");
  }
}

export class DummyTestRepository extends MockRepository<TestEntity> {
  // biome-ignore lint/complexity/noUselessConstructor: For a reason
  constructor() {
    super();
  }

  override fetchAll(): Promise<RepositoryResult<TestEntity[]>> {
    return Promise.resolve(Result.Err(new DummyRepoError()));
  }
}
