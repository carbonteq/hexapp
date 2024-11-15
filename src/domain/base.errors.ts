export class DomainError extends Error {
  protected constructor(msg: string) {
    super();

    this.name = this.constructor.name;
    this.message = msg;
  }
}

export class GenericDomainError extends DomainError {}

export class NotFoundError extends DomainError {}

export class AlreadyExistsError extends DomainError {}

export class UnauthorizedOperation extends DomainError {}
export class InvalidOperation extends DomainError {}

export class ValidationError extends DomainError {
  // biome-ignore lint/complexity/noUselessConstructor: Need to make the constructor public
  public constructor(message: string) {
    super(message);
  }
}

export class GuardViolationError extends DomainError {}

export type DomainErr =
  | AlreadyExistsError
  | GenericDomainError
  | InvalidOperation
  | NotFoundError
  | UnauthorizedOperation
  | ValidationError
  | GuardViolationError;
