import { AppErrStatus, AppResult, MockRepository } from '../../lib';
import { TestEntity } from '../dummy-objects/test.entity';
import { DummyTestRepository } from '../dummy-objects/test.repository';

describe('test repository', () => {
  let repo: MockRepository<TestEntity>;
  let ent1: TestEntity;
  let ent2: TestEntity;

  beforeEach(() => {
    repo = new DummyTestRepository();
    ent1 = TestEntity.create();
    ent2 = TestEntity.create();
    repo.insert(ent1);
  });

  describe('valid operations', () => {
    it('on fetch', async () => {
      const res = await repo.fetchById(ent1.Id);

      expect(res.unwrap()).toEqual(ent1.serialize());
    });

    it('on insert', async () => {
      const res = await repo.insert(ent2);

      expect(res.unwrap()).toBe(ent2);
    });

    it('on update', async () => {
      const ent1Changed = TestEntity.from(ent1);
      ent1Changed.updateRandomly();

      const res = await repo.update(ent1Changed);

      const entReturned = res.unwrap();

      expect(entReturned).toBe(ent1Changed);
      expect(entReturned?.Id).toBe(ent1.Id);
      expect(entReturned?.random).not.toBe(ent1.random);
    });

    it('on delete', async () => {
      const res = await repo.deleteById(ent1.Id);

      expect(res.unwrap()).toEqual(ent1.serialize());
    });
  });

  describe('bubbling errors with app result tryFromPromise', () => {
    it('on fetch', async () => {
      const fetchResult = await repo.fetchById(ent2.Id);

      const res = AppResult.fromResult(fetchResult);

      expect(res.isOk()).toBeFalse();

      const err = res.unwrapErr();
      expect(err).toBeDefined();
      expect(err.status).toBe(AppErrStatus.NotFound);
    });

    it('on insert', async () => {
      const opRes = await repo.insert(ent1);
      const res = AppResult.fromResult(opRes);

      expect(res.unwrapErr().status).toBe(AppErrStatus.AlreadyExists);
    });

    it('on update', async () => {
      ent2.updateRandomly();
      const opRes = await repo.update(ent2);

      const res = AppResult.fromResult(opRes);

      expect(res.unwrapErr().status).toBe(AppErrStatus.NotFound);
    });

    it('on delete', async () => {
      const opRes = await repo.deleteById(ent2.Id);

      const res = AppResult.fromResult(opRes);

      expect(res.unwrapErr().status).toBe(AppErrStatus.NotFound);
    });
  });
});
