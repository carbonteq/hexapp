import type { UUIDVo } from "./valueObjects/uuid.vo";

class DomainError extends Error {
	protected constructor(msg: string) {
		super();

		this.name = this.constructor.name;
		this.message = msg;
		// this.message = `${this.name}: ${msg}`;
	}
}

export class GenericDomainError extends DomainError {}

export class NotFoundError extends DomainError {}

export class AlreadyExistsError extends DomainError {}

export class RelationNotFoundError extends NotFoundError {
	constructor(
		childEntName: string,
		parentEntName: string,
		childId: UUIDVo,
		parentId: UUIDVo,
	) {
		super(
			`${childEntName} <${childId.toString()}> does not exists for ${parentEntName} <${parentId.toString()}>`,
		);
	}
}

export class UnauthorizedOperation extends DomainError {}

export class InvalidOperation extends DomainError {}

export class ValidationError extends DomainError {}

export class FieldValidationError extends ValidationError {
	constructor(field: string, value: string, message = "") {
		super(`Validation failed for <${field} = ${value}> ${message}`);
	}
}

export class ExternalServiceFailure extends DomainError {}

export type DomainErr =
	| AlreadyExistsError
	| ExternalServiceFailure
	| GenericDomainError
	| InvalidOperation
	| NotFoundError
	| UnauthorizedOperation
	| ValidationError
	| FieldValidationError;
