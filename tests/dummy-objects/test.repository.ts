import { MockRepository, NotFoundError, RepositoryResult } from '../../lib';
import { TestEntity } from './test.entity';
import { Result } from '@carbonteq/fp';
import { InvalidOperation } from '@carbonteq/hexapp';

export class DummyRepoError extends NotFoundError {
  constructor() {
    super('dummy not found error');
  }
}

export class DummyTestRepository extends MockRepository<TestEntity> {
  fetchAll(): Promise<RepositoryResult<TestEntity[]>> {
    return Promise.resolve(Result.Err(new DummyRepoError()));
  }
}
