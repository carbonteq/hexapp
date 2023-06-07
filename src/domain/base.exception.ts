import type { UUID } from './types';

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
    childId: UUID,
    parentId: UUID,
  ) {
    super(
      `${childEntName} <ID: ${childId}> does not exists for ${parentEntName} <ID: ${parentId}>`,
    );
  }
}

export class UnauthorizedOperation extends DomainError {}

export class InvalidOperation extends DomainError {}

export class ValidationError extends DomainError {
  constructor(field: string, value: string, message = '') {
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
  | ValidationError;
