import {
	NotFoundError,
	UUID,
	AlreadyExistsError,
} from '@carbonteq/hexapp/domain';

export class TestEntNotFound extends NotFoundError {
	constructor(id: UUID) {
		super(`TestEnt<${id}> not found`);
	}
}

export class TestEntAlreadyExists extends AlreadyExistsError {
	constructor(id: UUID) {
		super(`TestEnt<${id}> already exists`);
	}
}
