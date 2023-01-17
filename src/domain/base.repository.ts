import type { BaseEntity } from './base.entity';
import { Result } from 'oxide.ts';
import {
	AlreadyExistsError,
	NotFoundError,
	ExternalServiceFailure,
} from './base.exception';

export class DatabaseConnectivityError extends ExternalServiceFailure {
	constructor(message: string) {
		super(message);
		this.name = 'DatabaseConnectivityError';
	}
}

export type RepositoryError =
	| NotFoundError
	| AlreadyExistsError
	| DatabaseConnectivityError;
export type RepositoryResult<T, E = DatabaseConnectivityError> = Result<
	T,
	E | DatabaseConnectivityError
>;

export abstract class BaseRepository<T extends BaseEntity> {
	abstract fetchById(
		Id: BaseEntity['Id'],
	): Promise<RepositoryResult<T, NotFoundError>>;

	abstract fetchAll(): Promise<RepositoryResult<T[]>>;

	abstract insert(entity: T): Promise<RepositoryResult<T, AlreadyExistsError>>;

	abstract update(entity: T): Promise<RepositoryResult<T, NotFoundError>>;

	abstract deleteById(
		Id: BaseEntity['Id'],
	): Promise<RepositoryResult<T, NotFoundError>>;

	abstract existsById(Id: BaseEntity['Id']): Promise<RepositoryResult<boolean>>;
}

export abstract class BaseRepositoryExtended<
	T extends BaseEntity,
> extends BaseRepository<T> {
	abstract fetchBy<U extends keyof T>(
		prop: U,
		val: T[U],
	): Promise<RepositoryResult<T, NotFoundError>>; // val: ValueForProp<T, U>
	abstract existsBy<U extends keyof T>(
		prop: U,
		val: T[U],
	): Promise<RepositoryResult<boolean>>;
	abstract deleteBy<U extends keyof T>(
		prop: U,
		val: T[U],
	): Promise<RepositoryResult<T, NotFoundError>>;

	async fetchById(Id: T['Id']): Promise<RepositoryResult<T, NotFoundError>> {
		return await this.fetchBy('Id', Id);
	}

	async existsById(Id: T['Id']): Promise<RepositoryResult<boolean>> {
		return await this.existsBy('Id', Id);
	}

	async deleteById(Id: T['Id']): Promise<RepositoryResult<T, NotFoundError>> {
		return await this.deleteBy('Id', Id);
	}
}
