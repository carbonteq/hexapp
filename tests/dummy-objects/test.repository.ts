import { TestEntity } from './test.entity';
import { Result } from '@carbonteq/fp';
import {
  DatabaseConnectivityError,
  MockRepository,
  RepositoryResult,
  // } from '../../lib';
} from '@carbonteq/hexapp';

export class DummyTestRepository extends MockRepository<TestEntity> {
  fetchAll(): Promise<
    RepositoryResult<TestEntity[], DatabaseConnectivityError>
  > {
    return Promise.resolve(
      Result.Err(new DatabaseConnectivityError("couldn't connect to database")),
    );
  }
}
